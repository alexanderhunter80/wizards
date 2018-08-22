import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as mojs from 'mo-js';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

  const OPTS = {
    fill:           'none',
    radius:         25,
    strokeWidth:    { 50: 0 },
    scale:          { 0: 0.5 },
    angle:          { 'rand(-35, -70)': 0 },
    duration:       500,
    left: 0,        top: 0,
    easing: 'cubic.out'
  };

  const circle1 = new mojs.Shape({
    ...OPTS,
    stroke:         'cyan',
  });

  const circle2 = new mojs.Shape({
    ...OPTS,
    radius:         { 0: 15 },
    strokeWidth:    { 30: 0 },
    stroke:         'red',
    delay:          'rand(75, 150)'
  });

  const circle3 = new mojs.Shape({
    ...OPTS,
    radius: {0: 10},
    strokeWidth: {20: 0},
    stroke: 'cyan',
    delay: 'rand(30, 100)'
  });

  const sparks = new mojs.Burst({
    left: 0, top: 0,
    radius: {0: 30, easing : 'cubic.out'},
    angle: {0: 90, easing : 'quad.out'},
    count: 50,
    children: {
      shape: 'cross',
      stroke: 'white',
      points: 12,
      radius: 10,
      fill: 'none',
      angle: {0: 360},
      duration: 500,
    }
  });

  const redSparks = new mojs.Burst({
    left: 0, top: 0,
    count: 8,
    radius: { 150: 350 },
    angle: {0: 90 , easing: 'cubic.out'},
    children: {
      shape: 'line',
      stroke: {'red': 'transparent'},
      strokeWidth: 5,
      scaleX: {0.5: 0},
      degreeShift: 'rand(-90, 90)',
      radius: 'rand(20, 300)',
      duration: 500,
      delay: 'rand(0, 150)',
    }
  });

  document.addEventListener( 'click', function (e) {

    circle1
      .tune({ x: e.pageX, y: e.pageY  })
      .replay();

    circle2
      .tune({ x: e.pageX, y: e.pageY  })
      .replay();

    circle3
      .tune({ x: e.pageX, y: e.pageY  })
      .replay();

    redSparks
      .tune({x: e.pageX, y: e.pageY})
      .replay();

    sparks
      .tune({ x: e.pageX, y: e.pageY })
      .replay();
  });
