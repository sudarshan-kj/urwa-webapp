import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

const AlertModal = ({ heading, callback, isOpen, setIsOpen }) => {
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  return (
    <>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {heading}
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure?</AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="red" onClick={callback}>
                Yes
              </Button>
              <Button ref={cancelRef} onClick={onClose} ml={3}>
                No
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AlertModal;
