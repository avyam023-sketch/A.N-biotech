// The home page hero's 3D blood cells, drawn with WebGL2. The cursor pushes them, a click scatters them,
// and scrolling the pinned hero funnels them into single file, the way a cell counter reads a sample.
// Without WebGL2 the hero simply stays plain.
(function () {
  var canvas = document.querySelector('[data-hero-model]');
  if (!canvas || !window.gsap) return;

  var gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: true });
  if (!gl) {
    canvas.parentNode.hidden = true;
    return;
  }

  var hero = canvas.closest('[data-hero]');
  var wheel = hero.querySelector('.hero-wheel');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isSmall = window.innerWidth <= 820;

  var FOCAL = 2.75;
  var NEAR_DEPTH = 4.5;
  var FAR_DEPTH = 16;
  var STREAM_DEPTH = 8;
  var STREAM_RADIUS_PX = 34;
  var STRIDE = 14;

  // Geometry

  // Evans and Fung's measured profile of a red blood cell, spun around its axis.
  function redCellGeometry(rings, segments) {
    var profile = [];
    for (var i = 0; i <= rings; i++) {
      var r = Math.sin((i / rings) * Math.PI / 2);
      var r2 = r * r;
      profile.push([r, 0.5 * Math.sqrt(Math.max(0, 1 - r2)) * (0.207 + 2.003 * r2 - 1.123 * r2 * r2)]);
    }
    for (var k = rings - 1; k >= 0; k--) profile.push([profile[k][0], -profile[k][1]]);

    var positions = [];
    var normals = [];
    profile.forEach(function (point, index) {
      var before = profile[Math.max(0, index - 1)];
      var after = profile[Math.min(profile.length - 1, index + 1)];
      var nr = -(after[1] - before[1]);
      var ny = after[0] - before[0];
      var length = Math.hypot(nr, ny) || 1;
      for (var j = 0; j <= segments; j++) {
        var angle = (j / segments) * Math.PI * 2;
        positions.push(point[0] * Math.cos(angle), point[1], point[0] * Math.sin(angle));
        normals.push((nr / length) * Math.cos(angle), ny / length, (nr / length) * Math.sin(angle));
      }
    });
    return { positions: positions, normals: normals, indices: gridIndices(profile.length - 1, segments) };
  }

  // A sphere with uneven bumps, for white cells and platelets.
  function lumpyGeometry(rows, segments) {
    function point(theta, phi) {
      var radius = 1 + 0.07 * Math.sin(3 * theta + 2 * phi) + 0.05 * Math.sin(5 * phi + theta) * Math.sin(4 * theta);
      return [radius * Math.sin(theta) * Math.cos(phi), radius * Math.cos(theta), radius * Math.sin(theta) * Math.sin(phi)];
    }
    var positions = [];
    var normals = [];
    var step = 0.01;
    for (var i = 0; i <= rows; i++) {
      var theta = (i / rows) * Math.PI;
      for (var j = 0; j <= segments; j++) {
        var phi = (j / segments) * Math.PI * 2;
        var p = point(theta, phi);
        var a = point(theta + step, phi);
        var b = point(theta, phi + step);
        var ax = a[0] - p[0], ay = a[1] - p[1], az = a[2] - p[2];
        var bx = b[0] - p[0], by = b[1] - p[1], bz = b[2] - p[2];
        var nx = by * az - bz * ay, ny = bz * ax - bx * az, nz = bx * ay - by * ax;
        var length = Math.hypot(nx, ny, nz);
        if (length < 1e-7) { nx = p[0]; ny = p[1]; nz = p[2]; length = Math.hypot(nx, ny, nz); }
        positions.push(p[0], p[1], p[2]);
        normals.push(nx / length, ny / length, nz / length);
      }
    }
    return { positions: positions, normals: normals, indices: gridIndices(rows, segments) };
  }

  function gridIndices(rows, segments) {
    var indices = [];
    var perRow = segments + 1;
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < segments; j++) {
        var a = i * perRow + j, b = a + perRow, c = a + 1, d = b + 1;
        indices.push(a, c, b, c, d, b);
      }
    }
    return indices;
  }

  // Shaders

  var vertexSource = '#version 300 es\n' +
    'layout(location=0) in vec3 aPos;\n' +
    'layout(location=1) in vec3 aNormal;\n' +
    'layout(location=2) in vec3 iPos;\n' +
    'layout(location=3) in vec4 iQuat;\n' +
    'layout(location=4) in vec3 iScale;\n' +
    'layout(location=5) in vec3 iColor;\n' +
    'layout(location=6) in float iHeat;\n' +
    'uniform vec2 uProj;\n' +
    'out vec3 vNormal; out vec3 vView; out vec3 vColor; out float vHeat;\n' +
    'vec3 rot(vec4 q, vec3 v) { return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }\n' +
    'void main() {\n' +
    '  vec3 p = rot(iQuat, aPos * iScale) + iPos;\n' +
    '  vNormal = rot(iQuat, aNormal / iScale);\n' +
    '  vView = -p; vColor = iColor; vHeat = iHeat;\n' +
    '  gl_Position = vec4(p.x * uProj.x, p.y * uProj.y, -1.05 * p.z - 2.05, -p.z);\n' +
    '}\n';

  var fragmentSource = '#version 300 es\n' +
    'precision highp float;\n' +
    'in vec3 vNormal; in vec3 vView; in vec3 vColor; in float vHeat;\n' +
    'uniform float uSolid;\n' +
    'out vec4 fragColor;\n' +
    'const vec3 BACKGROUND = vec3(0.078, 0.231, 0.384);\n' +
    'void main() {\n' +
    '  vec3 N = normalize(vNormal);\n' +
    '  vec3 V = normalize(vView);\n' +
    '  vec3 L = normalize(vec3(-0.45, 0.75, 0.55));\n' +
    '  float facing = max(dot(N, V), 0.0);\n' +
    '  float rim = pow(1.0 - facing, 2.4);\n' +
    '  float light = clamp((dot(N, L) + 0.55) / 1.55, 0.0, 1.0);\n' +
    '  vec3 color = mix(vColor * vec3(0.3, 0.2, 0.32), vColor, light);\n' +
    '  color += vColor * vec3(1.0, 0.55, 0.5) * rim * 0.8;\n' +
    '  color += vec3(0.16, 0.3, 0.5) * pow(max(dot(N, normalize(vec3(0.6, -0.65, 0.3))), 0.0), 2.0) * 0.35;\n' +
    '  color += vec3(1.0, 0.92, 0.88) * pow(max(dot(N, normalize(L + V)), 0.0), 70.0) * 0.55;\n' +
    '  color += vColor * vHeat * 0.55;\n' +
    '  float fog = smoothstep(5.0, 17.0, vView.z > 0.0 ? length(vView) : 0.0);\n' +
    '  color = mix(color, BACKGROUND, fog * 0.72);\n' +
    '  float alpha = mix(mix(0.78, 1.0, rim), 1.0, uSolid);\n' +
    '  fragColor = vec4(color * alpha, alpha);\n' +
    '}\n';

  function compile(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  var program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.parentNode.hidden = true;
    return;
  }
  gl.useProgram(program);
  var uProj = gl.getUniformLocation(program, 'uProj');
  var uSolid = gl.getUniformLocation(program, 'uSolid');

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  // Cells

  function random(min, max) { return min + Math.random() * (max - min); }
  function mix(a, b, t) { return a + (b - a) * t; }
  function clamp01(t) { return Math.min(1, Math.max(0, t)); }
  function smoothstep(a, b, t) { t = clamp01((t - a) / (b - a)); return t * t * (3 - 2 * t); }

  function makeCell(kind) {
    var depthBias = Math.pow(Math.random(), 0.75);
    var axisX = random(-1, 1), axisY = random(-1, 1), axisZ = random(-1, 1);
    var axisLength = Math.hypot(axisX, axisY, axisZ) || 1;
    var shade = Math.random();
    return {
      kind: kind,
      u: random(-1.1, 1.1),
      y: random(-1.2, 1.2),
      depth: mix(NEAR_DEPTH, FAR_DEPTH, depthBias),
      offsetX: 0, offsetY: 0, velocityX: 0, velocityY: 0,
      phase: random(0, Math.PI * 2),
      wander: random(0.02, 0.07),
      jitter: random(-0.5, 0.5),
      size: kind === 'red' ? random(0.42, 0.68) : kind === 'white' ? random(0.55, 0.72) : random(0.1, 0.16),
      relative: kind === 'red' ? 1 : kind === 'white' ? 1.25 : 0.32,
      squash: kind === 'platelet' ? 0.45 : 1,
      quat: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
      axis: [axisX / axisLength, axisY / axisLength, axisZ / axisLength],
      spin: random(0.08, 0.32),
      extraSpin: 0,
      heat: 0,
      delay: reduceMotion ? 0 : random(0, 0.9),
      color: kind === 'red' ? [mix(0.62, 0.85, shade), mix(0.1, 0.17, shade), mix(0.09, 0.14, shade)]
        : kind === 'white' ? [0.56, 0.63, 0.78]
        : [0.92, 0.72, 0.58],
      finalDepth: 0
    };
  }

  function normalize(q) {
    var length = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
    q[0] /= length; q[1] /= length; q[2] /= length; q[3] /= length;
  }

  var redCount = isSmall ? 30 : 74;
  var whiteCount = isSmall ? 2 : 5;
  var plateletCount = isSmall ? 10 : 22;

  var cells = [];
  var i;
  for (i = 0; i < redCount; i++) cells.push(makeCell('red'));
  var lumpyStart = cells.length;
  for (i = 0; i < whiteCount; i++) cells.push(makeCell('white'));
  for (i = 0; i < plateletCount; i++) cells.push(makeCell('platelet'));
  cells.forEach(function (cell) { normalize(cell.quat); });

  var redOrder = cells.slice(0, lumpyStart);
  var lumpyOrder = cells.slice(lumpyStart);

  // Buffers

  var instanceData = new Float32Array(cells.length * STRIDE);
  var instanceBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, instanceData.byteLength, gl.DYNAMIC_DRAW);

  function makeMesh(geometry, firstInstance) {
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    var positions = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positions);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    var normals = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normals);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
    var base = firstInstance * STRIDE * 4;
    [[2, 3, 0], [3, 4, 3], [4, 3, 7], [5, 3, 10], [6, 1, 13]].forEach(function (attribute) {
      gl.enableVertexAttribArray(attribute[0]);
      gl.vertexAttribPointer(attribute[0], attribute[1], gl.FLOAT, false, STRIDE * 4, base + attribute[2] * 4);
      gl.vertexAttribDivisor(attribute[0], 1);
    });

    var indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geometry.indices), gl.STATIC_DRAW);
    gl.bindVertexArray(null);

    return { vao: vao, count: geometry.indices.length };
  }

  var redMesh = makeMesh(redCellGeometry(isSmall ? 16 : 26, isSmall ? 28 : 44), 0);
  var lumpyMesh = makeMesh(lumpyGeometry(isSmall ? 18 : 28, isSmall ? 24 : 40), lumpyStart);

  // Input and layout

  var aspect = 1;
  var sizeScale = 1;
  var pixelRatio = Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2);
  var pointer = { x: 0, y: 0, active: false, velocityX: 0, velocityY: 0, parallaxX: 0, parallaxY: 0 };
  var target = 0;
  var progress = 0;
  var scrollSpeed = 0;
  var clock = 0;
  var isVisible = true;

  function resize() {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if (!width || !height) return;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = width / height;
    sizeScale = Math.max(0.45, Math.min(1, aspect / 1.6));
    // Setting a canvas's size wipes it, so redraw straight away rather than flash empty.
    step(0);
  }

  function toScene(clientX, clientY) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width * 2 - 1) * aspect,
      y: 1 - (clientY - rect.top) / rect.height * 2,
      inside: clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
    };
  }

  function movePointer(clientX, clientY) {
    var point = toScene(clientX, clientY);
    if (pointer.active && point.inside) {
      pointer.velocityX += (point.x - pointer.x) * 6;
      pointer.velocityY += (point.y - pointer.y) * 6;
    }
    pointer.x = point.x;
    pointer.y = point.y;
    pointer.active = point.inside;
  }

  function scatter(clientX, clientY) {
    var point = toScene(clientX, clientY);
    cells.forEach(function (cell) {
      var dx = cell.screenX - point.x;
      var dy = cell.screenY - point.y;
      var distance = Math.hypot(dx, dy) || 0.001;
      var force = Math.pow(clamp01(1 - distance / 1.15), 1.5);
      cell.velocityX += (dx / distance) * force * 3.4;
      cell.velocityY += (dy / distance) * force * 3.4;
      cell.extraSpin += force * 9;
      cell.heat = Math.max(cell.heat, force);
    });
  }

  // Each frame

  function step(dt) {
    clock += dt;

    var ease = 1 - Math.exp(-dt * 6);
    var previous = progress;
    progress += (target - progress) * ease;
    if (dt > 0) scrollSpeed += ((progress - previous) / dt - scrollSpeed) * ease;

    pointer.parallaxX += ((pointer.active ? pointer.x : 0) - pointer.parallaxX) * ease * 0.4;
    pointer.parallaxY += ((pointer.active ? pointer.y : 0) - pointer.parallaxY) * ease * 0.4;
    pointer.velocityX *= Math.exp(-dt * 7);
    pointer.velocityY *= Math.exp(-dt * 7);

    var isPinned = hero.classList.contains('is-pinned');
    var streamX = 0;
    if (isPinned) {
      var heroRect = canvas.getBoundingClientRect();
      streamX = ((wheel.getBoundingClientRect().right - 62 - heroRect.left) / heroRect.width * 2 - 1) * aspect;
    }
    var streamOffset = progress * 15 + clock * 0.05;
    var streamRadius = STREAM_RADIUS_PX / (canvas.clientHeight / 2);
    var streamLength = cells.length * streamRadius * 2.5;
    var damping = Math.exp(-dt * 2.4);

    cells.forEach(function (cell, index) {
      // Drift, nearer cells faster, wrapping unseen past the edges
      var near = 6 / cell.depth;
      cell.u -= dt * 0.012 * near / Math.max(aspect, 0.6);
      cell.y += dt * 0.028 * near + (isPinned ? 0 : scrollSpeed * dt * 1.5 * near);
      var margin = cell.size * sizeScale * FOCAL / cell.depth + cell.wander + 0.04;
      var edgeU = 1 + margin / aspect;
      var edgeY = 1 + margin;
      if (cell.u < -edgeU) cell.u = edgeU;
      if (cell.y > edgeY) cell.y = -edgeY;
      if (cell.y < -edgeY) cell.y = edgeY;

      var driftX = cell.u * aspect + Math.sin(clock * 0.25 + cell.phase) * cell.wander;
      var driftY = cell.y + Math.cos(clock * 0.2 + cell.phase) * cell.wander;

      // Scrolling the pinned hero draws cells one after another into the stream
      var blend = isPinned ? smoothstep(0.1 + 0.11 * (index / cells.length), 0.26 + 0.11 * (index / cells.length), progress) : 0;
      var slot = (index * streamRadius * 2.5 + streamOffset) % streamLength;
      var streamY = slot - streamLength / 2;
      var depth = mix(cell.depth, STREAM_DEPTH, blend);
      var x = mix(driftX, streamX + cell.jitter * streamRadius * 0.7, blend);
      var y = mix(driftY, streamY, blend);

      // The pointer pushes cells off their path and a spring brings them back
      var pushX = x + cell.offsetX;
      var pushY = y + cell.offsetY;
      if (pointer.active) {
        var dx = pushX - pointer.x;
        var dy = pushY - pointer.y;
        var distance = Math.hypot(dx, dy) || 0.001;
        var reach = clamp01(1 - distance / 0.5);
        if (reach > 0) {
          var force = reach * reach * near;
          cell.velocityX += ((dx / distance) * 3.2 + pointer.velocityX * 0.9) * force * dt * 5;
          cell.velocityY += ((dy / distance) * 3.2 + pointer.velocityY * 0.9) * force * dt * 5;
          cell.extraSpin += force * dt * 14;
          cell.heat = Math.max(cell.heat, reach * reach);
        }
      }
      cell.velocityX += -cell.offsetX * dt * 2.2;
      cell.velocityY += -cell.offsetY * dt * 2.2;
      cell.velocityX *= damping;
      cell.velocityY *= damping;
      cell.offsetX += cell.velocityX * dt;
      cell.offsetY += cell.velocityY * dt;
      cell.heat *= Math.exp(-dt * 1.6);
      cell.extraSpin *= Math.exp(-dt * 1.2);

      cell.screenX = x + cell.offsetX;
      cell.screenY = y + cell.offsetY;
      cell.finalDepth = depth;

      var sceneX = cell.screenX + pointer.parallaxX * 0.12 * (NEAR_DEPTH / depth);
      var sceneY = cell.screenY + pointer.parallaxY * 0.12 * (NEAR_DEPTH / depth);
      cell.position = [sceneX * depth / FOCAL, sceneY * depth / FOCAL, -depth];

      // Tumbling
      var angle = (cell.spin + cell.extraSpin + Math.abs(scrollSpeed) * 7) * dt * 0.5;
      var q = cell.quat;
      var ax = cell.axis[0] * angle, ay = cell.axis[1] * angle, az = cell.axis[2] * angle;
      var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
      q[0] = qx + ax * qw + ay * qz - az * qy;
      q[1] = qy + ay * qw + az * qx - ax * qz;
      q[2] = qz + az * qw + ax * qy - ay * qx;
      q[3] = qw - ax * qx - ay * qy - az * qz;
      normalize(q);

      var appear = reduceMotion ? 1 : clamp01((clock - cell.delay) / 0.9);
      appear = 1 - Math.pow(1 - appear, 3);
      cell.radius = Math.max(0.0001, mix(cell.size * sizeScale, streamRadius * cell.relative * depth / FOCAL, blend) * appear);
    });

    draw();
  }

  function byDepth(a, b) { return b.finalDepth - a.finalDepth; }

  function writeCells(list, start) {
    list.forEach(function (cell, index) {
      var at = (start + index) * STRIDE;
      instanceData[at] = cell.position[0];
      instanceData[at + 1] = cell.position[1];
      instanceData[at + 2] = cell.position[2];
      instanceData[at + 3] = cell.quat[0];
      instanceData[at + 4] = cell.quat[1];
      instanceData[at + 5] = cell.quat[2];
      instanceData[at + 6] = cell.quat[3];
      instanceData[at + 7] = cell.radius;
      instanceData[at + 8] = cell.radius * cell.squash;
      instanceData[at + 9] = cell.radius;
      instanceData[at + 10] = cell.color[0];
      instanceData[at + 11] = cell.color[1];
      instanceData[at + 12] = cell.color[2];
      instanceData[at + 13] = cell.heat;
    });
  }

  function draw() {
    // Far to near, so the slightly see-through cells layer correctly
    redOrder.sort(byDepth);
    lumpyOrder.sort(byDepth);
    writeCells(redOrder, 0);
    writeCells(lumpyOrder, lumpyStart);

    gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, instanceData);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform2f(uProj, FOCAL / aspect, FOCAL);

    // Solid cells first, so the see-through red ones blend over them correctly
    gl.uniform1f(uSolid, 1);
    gl.bindVertexArray(lumpyMesh.vao);
    gl.drawElementsInstanced(gl.TRIANGLES, lumpyMesh.count, gl.UNSIGNED_SHORT, 0, lumpyOrder.length);
    gl.uniform1f(uSolid, 0);
    gl.bindVertexArray(redMesh.vao);
    gl.drawElementsInstanced(gl.TRIANGLES, redMesh.count, gl.UNSIGNED_SHORT, 0, redOrder.length);
    gl.bindVertexArray(null);
  }

  // Slow devices trade sharpness for smoothness once, instead of stuttering
  var slowFrames = 0;
  var sampledFrames = 0;
  function watchSpeed(rawDt) {
    if (sampledFrames > 120 || pixelRatio <= 1 || rawDt > 0.25) return;
    sampledFrames++;
    if (rawDt > 0.034) slowFrames++;
    if (sampledFrames === 120 && slowFrames > 60) {
      pixelRatio = 1;
      resize();
    }
  }

  function tick(time, deltaMs) {
    if (!isVisible || document.hidden) return;
    var rawDt = deltaMs / 1000;
    watchSpeed(rawDt);
    step(Math.min(rawDt, 0.05));
  }

  new ResizeObserver(resize).observe(canvas);
  resize();

  if (reduceMotion) {
    step(0);
    return;
  }

  window.addEventListener('pointermove', function (event) { movePointer(event.clientX, event.clientY); }, { passive: true });
  window.addEventListener('touchmove', function (event) {
    if (event.touches[0]) movePointer(event.touches[0].clientX, event.touches[0].clientY);
  }, { passive: true });
  window.addEventListener('touchend', function () { pointer.active = false; }, { passive: true });
  document.documentElement.addEventListener('pointerleave', function () { pointer.active = false; });

  // A click rather than a press, so starting a swipe to scroll on a phone doesn't set it off.
  hero.addEventListener('click', function (event) {
    if (event.target.closest('a, button')) return;
    scatter(event.clientX, event.clientY);
  });

  document.addEventListener('hero:progress', function (event) { target = event.detail; });

  new IntersectionObserver(function (entries) {
    isVisible = entries[0].isIntersecting;
  }).observe(canvas);

  canvas.addEventListener('webglcontextlost', function () {
    gsap.ticker.remove(tick);
    canvas.parentNode.hidden = true;
  });

  step(0);
  gsap.ticker.add(tick);
})();
