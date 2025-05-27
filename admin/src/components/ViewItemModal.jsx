import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/react";
import React from "react";

export default function ViewItemModal({
    isOpen,
    onOpenChange,
    infoShow,
    itemInfo,
    databaseInfo,
}) {
    const newProps = {
        itemInfo: itemInfo,
        databaseInfo: databaseInfo,
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Detalles del vehículo
                        </ModalHeader>
                        <ModalBody>
                            {React.cloneElement(infoShow, {
                                ...infoShow.props,
                                ...newProps,
                            })}
                        </ModalBody>
                        <ModalFooter />
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
