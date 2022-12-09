import PlotSeriesSplitter from './components/plot-series-splitter';

const components = [
  {
    class: PlotSeriesSplitter,
    selector: '.plot-container'
  }
]

components.forEach(component => {
  $(function () {
    console.log('LOG', 'initializing component ' + component.class.name);
    const node = document.querySelector(component.selector)
    if (node !== null) {
      new component.class(node, component.options)
    }
  });
})