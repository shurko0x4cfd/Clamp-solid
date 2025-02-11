
import { render } from 'solid-js/web';
import { createSignal } from 'solid-js';
import Clamp from 'clamp-solid';


const Example = () => {
	const [min, minSet] = createSignal(10);
	const [max, maxSet] = createSignal(75);
	const width = '12em';

	const Example =
		<div class='example'>
			<Clamp {...{ width, min, minSet, max, maxSet, }} />

			<div class='numbers'>
				<div>min: {min()}</div>
				<div>max: {max()}</div>
			</div>
		</div>;

	return Example;
};

const clampHolder = document.querySelector('.clamp-holder-1534705cd763');
render(Example, clampHolder);
