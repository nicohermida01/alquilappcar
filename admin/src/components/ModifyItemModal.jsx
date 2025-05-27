import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";

export default function ModifyItemModal({
    itemInfo,
    isOpen,
    onOpenChange,
    updateItemList,
    registerForm,
}) {
    const newProps = {
        itemInfo: itemInfo,
        updateItemList: updateItemList,
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
                            })}
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
