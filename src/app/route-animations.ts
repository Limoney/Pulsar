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


const tempNameSequance = [
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
export const tempName = trigger('appRouteAnimations', tempNameSequance);

const algorithmPageTransitionSequance = [
	transition('* <=> *', [
		group([
			query(':enter', [
				style({
					position: 'absolute',
					width: '100%',
					height: '100%',
					top: '-50%',
					left: '-50%',
					// transform: 'scale(0.1)',
				}),
			], { optional: true }),
			query(':leave', [
				style({	
					position: 'absolute',
					width: '100%',
					height: '100%',
					top: '0',
					left: '0'
				}),
			], { optional: true }),
		]),

		group([
			query(':leave', [
				animate('600ms ease', style({
					left: '100%'
				})),
			], { optional: true }),
			query(':enter', [
				animate('600ms ease', style({
					left: '0%',
					// top: '0%'
				})),
			], { optional: true }),
		])
	]),
]

export const algorithmPageTransition = trigger('algorithmRouteAnimations', algorithmPageTransitionSequance);

// export const tempName2 = trigger('algorithmRouteAnimations', tempNameSequance);