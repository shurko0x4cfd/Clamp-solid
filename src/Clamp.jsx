
import './clamp.css';
import { createSignal, createEffect, onCleanup } from 'solid-js';


const Clamp = props => {

	const {
		min, minSet,
		max, maxSet,
		lowerLimit = 0,
		upperLimit,
		width = '100%',
		height = '24',
		float = false,
		orient = 'horizontal',
	} = props;

	let clampRef, startRHRef, endRHRef;

	const defaultVolume = float ? 1 : 100;
	const absMin = lowerLimit || 0;
	const absMax = upperLimit ?? defaultVolume;
	const volume = absMax - absMin || defaultVolume;

	const [currentMinFloat, currentMinFloatSet] =
		createSignal(min ? min() : absMin);

	const [currentMaxFloat, currentMaxFloatSet] =
		createSignal(max ? max() : absMax);

	const [currentMin, currentMinSet] = (min && minSet)
		? [min, minSet] : createSignal(null);

	const [currentMax, currentMaxSet] = (max && maxSet)
		? [max, maxSet] : createSignal(null);

	const thumbWidth = height;

	const [leftSpaceWidth, leftSpaceWidthSet] = createSignal(0);
	const [rightSpaceWidth, rightSpaceWidthSet] = createSignal(0);

	const sliderOrient = orient === 'vertical' ? 'vertical' : 'horizontal';

	createEffect(() => {
		const minFloat = currentMinFloat();
		const min = float ? minFloat : Math.round(minFloat);
		currentMinSet(min);
	});

	createEffect(() => {
		const maxFloat = currentMaxFloat();
		const max = float ? maxFloat : Math.round(maxFloat);
		currentMaxSet(max);
	});

	const sliderWidth = width ? `${width}` : `100%`;
	const sliderStyle = `width: ${sliderWidth};`;

	setTimeout(() => {
		const resizeObserver = new ResizeObserver(() => {
			update('min');
			update('max');
		});

		resizeObserver.observe(clampRef);
	});

	const update = (control, movementX = 0) => {

		const canvasWidth = clampRef.getBoundingClientRect().width;
		const payloadWidth = canvasWidth - thumbWidth * 2;
		const floaVolDelta = movementX * volume / payloadWidth;
		const volDelta = floaVolDelta;

		if (control === 'min') {
			let newMin = currentMinFloat() + volDelta;

			if (newMin < absMin)
				newMin = absMin;
			else if (newMin > absMax)
				newMin = absMax;
			else if (newMin > currentMaxFloat())
				newMin = currentMaxFloat();

			currentMinFloatSet(newMin);
			let newLeftSpaceWidth = (newMin - lowerLimit) * payloadWidth / volume;

			const newLeftSpaceWidthLimit = canvasWidth - 2 * thumbWidth - rightSpaceWidth();

			if (newLeftSpaceWidth > newLeftSpaceWidthLimit)
				newLeftSpaceWidth = newLeftSpaceWidthLimit;

			if (newLeftSpaceWidth > payloadWidth)
				newLeftSpaceWidth = payloadWidth;

			let validLeftSpaceWidth = 0;

			if (newLeftSpaceWidth <= 0)
				validLeftSpaceWidth = 0;
			else
				validLeftSpaceWidth = newLeftSpaceWidth;

			const roundedLeftSpaceWidth = Math.round(validLeftSpaceWidth);
			leftSpaceWidthSet(roundedLeftSpaceWidth);

			if (roundedLeftSpaceWidth === 0)
				startRHRef.classList.add('d-none');
			else
				startRHRef.classList.remove('d-none');
		}
		else if (control === 'max') {
			let newMax = currentMaxFloat() + volDelta;

			if (newMax > absMax)
				newMax = absMax;
			else if (newMax < absMin)
				newMax = absMin;
			else if (newMax < currentMinFloat())
				newMax = currentMinFloat();

			currentMaxFloatSet(newMax);

			let newRightSpaceWidth = (absMax - newMax) * payloadWidth / volume;

			const newRightSpaceWidthLimit = canvasWidth - 2 * thumbWidth - leftSpaceWidth();

			if (newRightSpaceWidth > newRightSpaceWidthLimit)
				newRightSpaceWidth = newRightSpaceWidthLimit;

			if (newRightSpaceWidth > payloadWidth)
				newRightSpaceWidth = payloadWidth;

			if (newRightSpaceWidth < 0) newRightSpaceWidth = 0;
			else newRightSpaceWidth = newRightSpaceWidth;

			const roundedRightSpaceWidth = Math.round(newRightSpaceWidth);
			rightSpaceWidthSet(roundedRightSpaceWidth);

			if (roundedRightSpaceWidth === 0)
				endRHRef.classList.add('d-none');
			else
				endRHRef.classList.remove('d-none');
		};
	};

	const onMouseMoveItself = (evt, control) => {
		evt.preventDefault();

		const movementX = evt.movementX;
		update(control, movementX);
	};

	const listeners = [];

	const removeListeners = () => {
		listeners.forEach(listener => document.removeEventListener(...listener));
		listeners.length = 0;
	};

	const onPointerDown = (evt, control) => {
		evt.preventDefault();
		evt.target.focus();
		removeListeners();

		const onPointerMove = evt => onMouseMoveItself(evt, control);

		const onPointerUp = evt => {
			evt.preventDefault();
			removeListeners();
		};

		document.addEventListener('pointermove', onPointerMove);
		document.addEventListener('pointerup', onPointerUp);

		listeners.push(
			['pointermove', onPointerMove],
			['pointerup', onPointerUp],
		);
	};

	onCleanup(removeListeners);

	const Clamp =
		<div class={`clamp clamp_${sliderOrient}`}
			aria-label='Slider'
			aria-description='Two-thumb slider wiget'
			aria-orientation={sliderOrient}
			ref={clampRef}
			style={sliderStyle}
		>
			<div class='rail-holder' style={`width: ${leftSpaceWidth()}px;`} ref={startRHRef}>
				<div class='rail start-rail' />
			</div>

			<div role='slider' aria-label='Min slider thumb'
				aria-description='Control of minimal value'
				class='thumb thumb_start'
				tabindex={0}
				aria-valuenow={currentMin()}
				aria-valuemin={absMin}
				aria-valuemax={absMax}
				style={`width: ${thumbWidth}px;`}
				onPointerDown={evt => onPointerDown(evt, 'min')}
			/>

			<div class='rail-holder fg-1'>
				<div class='rail central-rail' />
			</div>

			<div role='slider' aria-label='Max slider thumb'
				aria-description='Control of maximal value'
				class='thumb thumb_ens'
				tabindex={0}
				aria-valuenow={currentMax()}
				aria-valuemin={absMin}
				aria-valuemax={absMax}
				style={`width: ${thumbWidth}px;`}
				onPointerDown={evt => onPointerDown(evt, 'max')}
			/>

			<div class='rail-holder' style={`width: ${rightSpaceWidth()}px;`} ref={endRHRef}>
				<div class='rail end-rail' />
			</div>
		</div>;

	return Clamp;
};

export default Clamp;
