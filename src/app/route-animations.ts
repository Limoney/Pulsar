import {
	trigger,
	transition,
	style,
	query,
	group,
	sequence,
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
			], { optional: true }),

			query(':leave', [
				style({
					position: 'absolute',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)',
					opacity: '1'
				}),
			], { optional: true }),
		]),

		group([
			query(':enter', [
				animate('600ms ease', style({ top: '50%', opacity: '1' })),
			], { optional: true }),

			query(':leave', [
				animate('600ms ease', style({ top: '-50%', opacity: '0', })),
			], { optional: true }),
		])
	]),
]

export const bottomTop = trigger('homepageRouteAnimations', bottomTopAnimationSequance);

// const testAnim = [
// 	transition('* <=> *', [
// 		group([
// 			query(':enter', [
// 				style({
// 					position: 'absolute',
// 					width: '100%',
// 					height: '100%',
// 					top: '0%',
// 					left: '-100%',
// 					// transform: 'scale(0.1)',
// 				}),
// 			], { optional: true }),
// 			query(':leave', [
// 				style({
// 					position: 'absolute',
// 					width: '100%',
// 					height: '100%',
// 					top: '0%',
// 					left: '0%'
// 				}),
// 			], { optional: true }),
// 		]),
//
// 		group([
// 			query(':leave', [
// 				animate('600ms ease', style({
// 					left: '100%'
// 				})),
// 			], { optional: true }),
// 			query(':enter', [
// 				animate('600ms ease', style({
// 					left: '0%',
// 					// top: '0%'
// 				})),
// 			], { optional: true }),
// 		])
// 	]),
// ]



const appPagesTransitionSequence = [
    transition('* <=> *', [
        group([
            query(':enter', [
                style({
                    position: 'absolute',
                    width: '100%',
                    // height: '100%',
                    top: '0%',
                    left: '0%',
                    opacity: '0.3',
                    // transform: 'scale(0.1)',
                    transform: 'rotateY(-90deg) scale(0.7)'
                }),
            ], { optional: true }),
            query(':leave', [
                style({
                    position: 'absolute',
                    width: '100%',
                    // height: '100%',
                    top: '0%',
                    left: '0%',
                    opacity: '1',
                    transform: 'rotateY(0deg) scale(1)'
                }),
            ], { optional: true }),
        ]),

        sequence([
            query(':leave', [
                animate('400ms cubic-bezier(.22,.61,.36,1)', style({
                    transform: 'rotateY(0deg) scale(0.7)'
                })),
            ], { optional: true }),

            query(':leave', [
                animate('300ms cubic-bezier(.65,.05,.36,1)', style({
                    transform: 'rotateY(90deg) scale(0.7)',
                    opacity: '0.3',
                })),

            ], { optional: true }),
            query(':enter', [
                animate('300ms cubic-bezier(.65,.05,.36,1)', style({
                    transform: 'rotateY(0deg) scale(0.7)',
                    opacity: '1',
                })),
            ], { optional: true }),

            query(':enter', [
                animate('400ms cubic-bezier(.22,.61,.36,1)', style({
                    transform: 'scale(1)',
                })),
            ], { optional: true }),
        ]),
    ]),
]

export const appPagesTransition = trigger('appRouteAnimations', appPagesTransitionSequence);

// export const tempName2 = trigger('algorithmRouteAnimations', algorithmPageTransitionSequence);

const algorithmPageTransitionSequence = [
    //transition('homepage <=> algorithms', [
    transition('* <=> *', [
        group([
            query('body', [
                style({
                    overflow: 'hidden'
                }),
            ], { optional: true }),

            query(':enter', [
                style({
                    position: 'absolute',
                    right: '-100%',
                    width: '100vw',
                    transform: 'scale(0.1)',
                    opacity: '0'
                }),
            ], { optional: true }),

            query(':leave', [
                style({
                    position: 'absolute',
                    left: '0%',
                    width: '100vw',
                    transform: 'scale(1)',
                    opacity: '1'
                }),
            ], { optional: true }),
        ]),

        group([
            sequence([
                query(':leave', [
                    animate('400ms ease', style({ transform: 'scale(0.1)'})),
                ], { optional: true }),
                query(':leave', [
                    animate('300ms ease', style({ left: '-100%' ,opacity: '0'  })),
                ], { optional: true }),
                query(':enter', [
                    animate('400ms ease', style({ right: '0%', opacity: '1' })),
                ], { optional: true }),
                query(':enter', [
                    animate('300ms ease', style({ transform: 'scale(1)' })),
                ], { optional: true }),
            ]),
        ])
    ]),
]

// TODO: add overflow: hidden to body during animation

export const algorithmPageTransition = trigger('algorithmRouteAnimations',algorithmPageTransitionSequence );
