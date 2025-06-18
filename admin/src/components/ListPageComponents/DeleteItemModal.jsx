import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import React from "react";

export default function DeleteItemModal({
    isOpen,
    onOpenChange,
    itemInfo,
    updateItemList,
    deleteItem,
    databaseInfo,
    deleteFunction,
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
                            Está seguro que desea eliminar el siguiente
                            elemento?
                        </ModalHeader>
                        <ModalBody>
                            {React.cloneElement(deleteItem, {
                                ...deleteItem.props,
                                ...newProps,
                                onClose: onClose,
                            })}
                        </ModalBody>
                        <ModalFooter className="flex justify-end">
                            <Button onPress={onClose} variant="light">
                                Cancelar
                            </Button>
                            <Button
                                onPress={() => {
                                    deleteFunction(itemInfo.id);
                                    onClose();
                                }}
                                color="danger"
                            >
                                Eliminar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
