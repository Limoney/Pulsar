import {
    trigger,
    transition,
    style,
    query,
    group,
    animateChild,
    animate,
    keyframes,
  } from '@angular/animations';

//   export const bottomTop =
//   trigger('routeAnimations', [
//     transition('* => bottom-top', [
//       query(':enter, :leave', [
//         style({
//             position: 'absolute',
//             left: '50%',
//             top: '100%',
//             transform: 'translate(-50%, -50%)',
//             opacity: '0'
//         }),
//       ]),
      
//       query(':enter', [
//         animate('600ms ease', style({ top: '50%', opacity: '1' })),
//       ]),
//     ]),

//     transition('bottom-top => *', [
//         query(':enter, :leave', [
//           style({
//             position: 'absolute',
//             left: '50%',
//             top: '50%',
//             transform: 'translate(-50%, -50%)',
//           }),
//         ]),
        
//         query(':leave', [
//           animate('600ms ease', style({ 
//             top: '-50%',
//             opacity: '0',
//           })),
//         ]),
//       ])
// ]);

const bottomTopAnimationSequance = [
  transition('* <=> *', [
    group([
      query(':enter', [
        style({
            position: 'absolute',
            left: '50%',
            top: '100%',
            transform: 'translate(-50%, -50%)',
            opacity: '0'
        }),
      ],{optional: true}),
  
      query(':leave', [
        style({
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: '1'
        }),
      ],{optional: true}),
    ]),

    group([
      query(':enter', [
        animate('600ms ease', style({ top: '50%', opacity: '1' })),
      ],{optional: true}),
  
      query(':leave', [
          animate('600ms ease', style({ top: '-50%',opacity: '0',})),
      ],{optional: true}),
    ])
  ]),
]

export const bottomTop = trigger('routeAnimations', bottomTopAnimationSequance);