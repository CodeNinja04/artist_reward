import React, { useState } from "react";
//import "./style.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useMoralis, useMoralisFile } from "react-moralis";
import { Moralis } from "moralis";

const UploadDataModal = () => {
  const [file, setFile] = useState("");
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
   const { isAuthenticated, user, authenticate, isAuthenticating } =
     useMoralis();

  const { saveFile, moralisFile } = useMoralisFile();

  const saveFileIPFS = async (f) => {
    console.log("FILE", f);
    const fileIpfs = await saveFile(f.name, file, { saveIPFS: true });
    console.log(fileIpfs);
  };

  const handleFinal = () => {
    saveFileIPFS(file);
    handleClose();
  };

   if (!isAuthenticated) {
     return (
       <div>
         <button onClick={() => authenticate()}>Authenticate</button>
       </div>
     );
   }

  return (
    <>
      <Button variant="warning" onClick={handleShow}>
        Upload File
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload file</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Upload the file</Form.Label>
              <Form.Control
                type="file"
                placeholder="Upload the file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFinal}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UploadDataModal;
