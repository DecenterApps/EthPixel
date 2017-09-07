import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal } from 'react-modal-bootstrap';
import { toggleModal } from '../../../actions/modalActions';
import CloseIcon from '../../Decorative/CloseIcon/CloseIcon';

const modalWrapperStyle = require('./modalWrapper.scss');

const ModalWrapper = ({
  isOpen, $toggleModal, currentModal, currentModalType, $style, modalFormName
}) => (
  <Modal isOpen={isOpen} onRequestHide={$toggleModal} dialogStyles={$style}>
    <div className={modalWrapperStyle['modal-header']}>
      <span
        role="button"
        tabIndex={0}
        onClick={() => $toggleModal(currentModalType, false, {}, modalFormName)}
      >
        <CloseIcon />
      </span>
    </div>
    <div className={modalWrapperStyle['modal-wrapper-body']}>
      { currentModal() }
    </div>
  </Modal>
);

ModalWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  $toggleModal: PropTypes.func.isRequired,
  currentModal: PropTypes.func.isRequired,
  $style: PropTypes.object.isRequired,
  currentModalType: PropTypes.string.isRequired,
  modalFormName: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  isOpen: state.modals.currentOpen,
  currentModal: state.modals.currentModal,
  $style: { open: { top: 15 } },
  currentModalType: state.modals.currentModalType,
  modalFormName: state.modals.modalFormName
});

export default connect(mapStateToProps, { $toggleModal: toggleModal })(ModalWrapper);
