import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleModal, getDataForBuyPixelModal } from '../../actions/modalActions';
import { BUY_PIXEL_MODAL } from '../../actions/types';
import panzoom from '../../modules/panzoom/panzoom';
import { getPixelRowAndColumn } from '../../actions/utils';

class Grid extends Component {
  constructor() {
    super();

    this.setCanvasSize = this.setCanvasSize.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this.goToPixel = this.goToPixel.bind(this);
    this.handleCanvasClick = this.handleCanvasClick.bind(this);
  }

  componentDidMount() {
    this.setCanvasSize(1000);
    this.updateCanvas(this.props.canvasArr, 1000, 1000);

    setTimeout(() => {
      this.panzoom = panzoom(this.canvas, { zoomSpeed: 0.065, smoothScroll: false });

      let dragging;

      this.canvas.addEventListener('panstart', () => { dragging = true; }, true);
      this.canvas.addEventListener('panend', () => { setTimeout(() => { dragging = false; }); }, true);
      this.canvas.addEventListener('click', (event) => { this.handleCanvasClick(dragging, event); });

      const userPixels = this.props.userPixels;

      // go to latest bought pixel if you have any pixels
      if (userPixels.length > 0) {
        const latestPixel = userPixels[userPixels.length - 1];
        const x = getPixelRowAndColumn(latestPixel.coors).column - 1;
        const y = getPixelRowAndColumn(latestPixel.coors).row - 1;
        this.goToPixel(x, y);
      }
    }, 0);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.canvasArr.length > 0) {
      this.updateCanvas(newProps.canvasArr, 1000, 1000);
    }

    if (newProps.centerPixel !== this.props.centerPixel) {
      const x = getPixelRowAndColumn(newProps.centerPixel).column - 1;
      const y = getPixelRowAndColumn(newProps.centerPixel).row - 1;
      this.goToPixel(x, y);
    }
  }

  setCanvasSize(size) {
    const canvas = this.canvas;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.width = size;
    canvas.height = size;
  }

  updateCanvas(frameData, width, height) {
    const context = this.canvas.getContext('2d');
    let img = context.createImageData(width, height);

    for (let i = 0; i < frameData.length; i++) {
      img.data[i] = frameData[i];
    }

    context.putImageData(img, 0, 0);
  }

  goToPixel(x, y) {
    const coordinates = { x, y };
    const zoom = 250;
    const pixelSize = zoom;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const center = (windowWidth - 1000) / 2;

    const posX = ((-(coordinates.x * zoom) + (windowWidth / 2)) - (pixelSize / 2)) - center;
    const posY = ((-(coordinates.y * zoom) + (windowHeight / 2)) - (pixelSize / 2));

    this.panzoom.changeTransform(posX, posY, zoom);
  }

  handleCanvasClick(dragging, event) {
    if (dragging) return;

    const scale = this.panzoom.getTransform().scale;
    const canvasBounds = this.canvas.getBoundingClientRect();

    const canvasOffset = {
      left: canvasBounds.left + window.scrollX,
      top: canvasBounds.top + window.scrollY
    };

    const x = Math.floor((-(canvasOffset.left - event.clientX)) / scale);
    const y = Math.floor((-(canvasOffset.top - event.clientY)) / scale);

    const modalData = getDataForBuyPixelModal({ x, y }, this.canvas.getContext('2d'));
    this.props.$toggleModal(BUY_PIXEL_MODAL, true, modalData, 'buyPixelForm');
  }

  render() {
    return (
      <div className="canvas-wrapper">
        <canvas ref={(canvas) => { this.canvas = canvas; }} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  canvasArr: state.user.canvasArr,
  centerPixel: state.user.centerPixel,
  userPixels: state.user.myPixelsArr
});

Grid.propTypes = {
  $toggleModal: PropTypes.func.isRequired,
  canvasArr: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  centerPixel: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number
  ]).isRequired,
  userPixels: PropTypes.array.isRequired
};

export default connect(mapStateToProps, { $toggleModal: toggleModal })(Grid);

