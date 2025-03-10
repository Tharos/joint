
Port layouts are functions that accept an array of port's `args` and return an array of port positions. Positions are relative to the element model bounding box. For example if we have an element at position `{ x:10, y:20 }` with a relative port position `{ x:1, y:2 }`, the absolute port position will be `{ x:11, y:22 }`.

Port layout can be defined only at the `group` level. Optionally you can pass some additional arguments into the layout function via `args`. The `args` is the only way to adjust port layout from the port definition perspective.

```javascript
const rect = new joint.shapes.standard.Rectangle({
    // ...
    ports: {
        groups: {
            'a': {
                position: {
                    name: 'layoutType',
                    args: {},
                }
            }
        },
        items: [
            // initialize 'rect' with port in group 'a'
            {
                group: 'a',
                args: {} // overrides `args` from the group level definition.
            },
            // ... other ports
        ]
    }
});

// ....
// add another port to group 'a'.
rect.addPort({ group:'a' });

```

### Pre-defined layouts:

#### On sides

A simple layout suitable for rectangular shapes. It evenly spreads ports along a single side.

<table>
    <tr>
        <td><b>name</b></td>
        <td><i>string</i></td>
        <td>
            Can be either <code>'left'</code>, <code>'right'</code>,  <code>'top'</code>,  <code>'bottom'</code>.
        </td>
    </tr>
    <tr>
        <td><b>args</b></td>
        <td><i>object</i></td>
        <td>
            <table>
                <tr>
                    <td><b>x</b></td>
                    <td>number</td>
                    <td rowspan="2">Overrides the <code>x</code> / <code>y</code> value calculated by the layout function. It can be defined as a percentage string e.g. <code>'50%'</code>,  <a href="#dia.attributes.calc">calc()</a> expression or a number</td>
                </tr>
                <tr>
                    <td><b>y</b></td>
                    <td>number</td>
                </tr>
                <tr>
                    <td><b>dx</b></td>
                    <td>number</td>
                    <td>Added to the <code>x</code> value calculated by the layout function</td>
                </tr>
                <tr>
                    <td><b>dy</b></td>
                    <td>number</td>
                    <td>Added to the <code>y</code> value calculated by the layout function</td>
                </tr>
                <tr>
                    <td><b>angle</b></td>
                    <td>number</td>
                    <td>The port rotation angle.</td>
                </tr>
            </table>
        </td>
    </tr>
</table>


```javascript
{
    name: 'left',
    args: {
        x: 10,
        y: 10,
        angle: 30,
        dx: 1,
        dy: 1
    }
}

```

#### Line

A layout which evenly spreads ports along a line defined by a `start` and `end` point.

<table>
    <tr>
        <td><b>name</b></td>
        <td><i>string</i></td>
        <td>
            <code>'line'</code>
        </td>
    </tr>
    <tr>
        <td><b>args</b></td>
        <td><i>object</i></td>
        <td>
            <table>
                <tr>
                    <td><b>start</b></td>
                    <td rowspan="2"><code>{ x: number|string, y: number|string }</code></td>
                    <td>The line starting point.</td>
                    <td rowspan="2"><code>x</code> and <code>y</code> can be a percentage string e.g. <code>'50%'</code>, <a href="#dia.attributes.calc">calc()</a> expression, or a number</td>
                </tr>
                <tr>
                    <td><b>end</b></td>
                    <td>The line end point</td>
                </tr>
            </table>
        </td>
    </tr>
</table>


```javascript
{
    name: 'line',
    args: {
        start: { x: 10, y: 10 },
        end: { x: 'calc(w)', y: '50%' }
    }
}

```

#### Absolute

It lays a port out at the given position (defined as `x`, `y` coordinates or percentage of the element dimensions).

<table>
    <tr>
        <td><b>name</b></td>
        <td><i>string</i></td>
        <td>
            <code>'absolute'</code>
        </td>
    </tr>
    <tr>
        <td><b>args</b></td>
        <td><i>object</i></td>
        <td>
            <table>
                <tr>
                    <td><b>x</b></td>
                    <td rowspan="2">number | string</td>
                    <td rowspan="2">Sets the port's <code>x</code> coordinate. It can be defined as a percentage string e.g. <code>'50%'</code>,  <a href="#dia.attributes.calc">calc()</a> expression or a number</td>
                </tr>
                <tr>
                    <td><b>y</b></td>
                </tr>
                <tr>
                    <td><b>angle</b></td>
                    <td>number</td>
                    <td>The port rotation angle.</td>
                </tr>
            </table>
        </td>
    </tr>
</table>

```javascript
{
    name: 'absolute',
    args: {
        x: '10%',
        y: 10,
        angle: 45
    }
}

```

#### Radial

Suitable for circular shapes. The `ellipseSpreads` evenly spreads ports along an ellipse. The `ellipse` spreads ports from the point at `startAngle` leaving gaps between ports equal to `step`.

<table>
    <tr>
        <td><b>name</b></td>
        <td><i>string</i></td>
        <td>
            Can be either <code>'ellipse'</code> or <code>'ellipseSpread'</code>.
        </td>
    </tr>
    <tr>
        <td><b>args</b></td>
        <td><i>object</i></td>
        <td>
            <table>
                <tr>
                    <td><b>x</b></td>
                    <td>number</td>
                    <td rowspan="2">Overrides the <code>x</code> / <code>y</code> value calculated by the layout function. It can be defined as a percentage string e.g. <code>'50%'</code>,  <a href="#dia.attributes.calc">calc()</a> expression or a number</td>
                </tr>
                <tr>
                    <td><b>y</b></td>
                    <td>number</td>
                </tr>
                <tr>
                    <td><b>dx</b></td>
                    <td>number</td>
                    <td>Added to the <code>x</code> value calculated by the layout function</td>
                </tr>
                <tr>
                    <td><b>dy</b></td>
                    <td>number</td>
                    <td>Added to the <code>y</code> value calculated by the layout function</td>
                </tr>
                <tr>
                    <td><b>dr</b></td>
                    <td>number</td>
                    <td>Added to the port delta rotation</td>
                </tr>
                <tr>
                    <td><b>startAngle</b></td>
                    <td>number</td>
                    <td>Default value is <code>0</code>.</td>
                </tr>
                <tr>
                    <td><b>step</b></td>
                    <td>number</td>
                    <td>
                        Default <code>360 / portsCount</code> for the <i>ellipseSpread</i>, <code>20</code> for the <i>ellipse</i>
                    </td>
                </tr>
                <tr>
                    <td><b>compensateRotation</b></td>
                    <td>boolean</td>
                    <td>set <code>compensateRotation: true</code> when you need to have ports in the same angle as an ellipse tangent at the port position.</td>
                </tr>
            </table>
        </td>
    </tr>
</table>

```javascript
{
    name: 'ellipseSpread',
    args: {
        dx: 1,
        dy: 1,
        dr: 1,
        startAngle: 10,
        step: 10,
        compensateRotation: false
    }
}
```


<iframe src="about:blank" data-src="demo/layout/Port/portRotationComp.html" style="height: 534px; width: 803px;"></iframe>

### Custom layout

An alternative for built-in layouts is providing a function directly, where the function returns an array of port transformations (position and angle).

```javascript
/**
* @param {Array<object>} portsArgs
* @param {g.Rect} elBBox shape's bounding box
* @param {object} opt Group options
* @returns {Array<joint.layout.Port.Transformation>}
*/
function(portsArgs, elBBox, opt) {
    // Distribute ports along the sinusoid
    return portsArgs.map((portArgs, index) => {
        const step = -Math.PI / 8;
        const y = Math.sin(index * step) * 50;
        return {
            x: index * 12,
            y: y + elBBox.height,
            angle: 0
        };
    });
}
```

### Port layouts demo

<iframe src="about:blank" data-src="demo/layout/Port/port.html" style="height: 442px; width: 803px;"></iframe>
