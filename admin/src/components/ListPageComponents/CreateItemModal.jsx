import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";

export default function CreateItemModal({
    isOpen,
    onOpenChange,
    updateItemList,
    registerForm,
    databaseInfo,
}) {
    const newProps = {
        updateItemList: updateItemList,
        databaseInfo: databaseInfo,
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                        <ModalBody>
                            {React.cloneElement(registerForm, {
                                ...registerForm.props,
                                ...newProps,
                                onClose: onClose,
                            })}
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
