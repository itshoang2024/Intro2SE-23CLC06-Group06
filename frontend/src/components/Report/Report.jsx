import React, { useState } from "react";
import Modal from "react-modal";
import { useToast } from "../Providers/ToastProvider.jsx";
import { useModal } from "../../hooks/useModal.js";
import { 
  AnimatedModal, 
  AnimatedBackdrop, 
  FadeInUp,
  InteractiveButton,
  Shake 
} from "../UI/Animations.jsx";

const Report = ({ onClose, onSubmit }) => {
  const [description, setDescription] = useState("");
  const [shake, setShake] = useState(false);
  const toast = useToast();
  const {
    getModalProps,
    getContentProps,
    getOverlayProps,
    handleClose,
    isShaking,
  } = useModal(onClose, { blockInteractions: false });

  const handleSubmit = () => {
    if (description.trim()) {
      if (description.length < 5) {
        toast("Description must be at least 5 characters long.", "warning");
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }

      try {
        onSubmit(description);
        setDescription("");
        handleClose();
      } catch (error) {
        console.error("Error during submit:", error);
        handleClose();
      }
    } else {
      toast("Please enter a description before submitting.", "warning");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <Modal {...getModalProps()}>
      <AnimatedBackdrop 
        isOpen={true}
        {...getOverlayProps()}
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatedModal
          isOpen={true}
          {...getContentProps()}
          className={`${getContentProps().className} report-modal-content`}
        >
          <FadeInUp delay={0.1}>
            <InteractiveButton className="close-button" onClick={handleClose}>
              ×
            </InteractiveButton>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <h2 className="report-title">REPORT</h2>
          </FadeInUp>

          <FadeInUp delay={0.3}>
            <p className="report-instruction">
              Please provide more detail about the issues
            </p>
          </FadeInUp>

          <FadeInUp delay={0.4}>
            <Shake trigger={shake}>
              <textarea
                className="report-textarea"
                placeholder="Enter the description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    handleClose();
                  }
                }}
              />
            </Shake>
          </FadeInUp>

          <FadeInUp delay={0.5}>
            <InteractiveButton className="submit-button" onClick={handleSubmit}>
              Submit
            </InteractiveButton>
          </FadeInUp>
        </AnimatedModal>
      </AnimatedBackdrop>
    </Modal>
  );
};

export default Report;
