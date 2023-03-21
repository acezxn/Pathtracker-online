# Pathtracker Online

Online robot path planning tool with simulation capabilties

[visit wbsite](https://acezxn.github.io/Pathtracker-online/)

## Features

- Spline curve generation using the catmull rom algorithm
- Robot pursuit behavior simulation with multiple algorithms using customized robot parameter settings
- Customizable export of coordinate data
- Simulation session saving and loading

## Quick guide

### Path generation

- Left clicking on the field to add new control point
- Dragging the control point to adjust the path
- Right clicking to remove the selected last control point
- Pressing the escape key to quickly remove the last control point
- Adjusting the ```Point density``` slider to add more intermediate points in the path

### Simulation

- The robot parameters can be adjusted in the ```Robot settings``` section
- The pursuit algorithm can be chosen in the ```Pure pursuit``` section
- Pressing the ```Simulate``` button to start the simulation

## Installation

Not required! But if you want to run this application locally, run this in your terminal

```bash
git clone https://github.com/acezxn/Pathtracker-online.git
cd Pathtracker-online
npm install
npm start
```
