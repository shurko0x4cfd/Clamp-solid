# Clamp

Two-thumb slider SolidJS component.

<img src="https://shurko.one/tmp/clamp/example/example-1.png" alt="Slider">

Draft, not production ready. Arrow keys are  not supported.

Usage:

```bash
npm i -D clamp-solid
```

```JavaScript
// Example

import { render } from 'solid-js/web';
import { createSignal } from 'solid-js';
import Clamp from 'clamp-solid';


const Example = () => {
	const [min, minSet] = createSignal(10);
	const [max, maxSet] = createSignal(75);
	const lowerLimit = 10;
	const upperLimit = 90;
	const width = '12em';

	const Example =
		<div class='example'>
			<Clamp {...{ width, min, minSet, max, maxSet, lowerLimit, upperLimit, }} />

			<div class='numbers'>
				<div>min: {min()}</div>
				<div>max: {max()}</div>
			</div>
		</div>;

	return Example;
};

const clampHolder = document.querySelector('.clamp-holder-1534705cd763');
render(Example, clampHolder);
```

All props are optional. Defaults:

wdith = 100%<br>
height = 24 actually is thumb width<br>
float = false<br>
lowerLimit = 0<br>
upperLimit = 100 for naturals and 1 for floats<br>
min, minSet, max, maxSet signals can be omitted, values can be grabbed from "aria-valuenow" props of start and end thumbs<br>
orient always "horizontal" - not implemented css for vertical<br>

[Live example](https://shurko.one/tmp/clamp/example)
