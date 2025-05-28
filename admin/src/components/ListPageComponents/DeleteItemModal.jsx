import { Modal, ModalContent, ModalHeader } from "@heroui/react";
import React from "react";

export default function DeleteItemModal({
    isOpen,
    onOpenChange,
    itemInfo,
    updateItemList,
    deleteItem,
    databaseInfo,
}) {
    const newProps = {
        itemInfo: itemInfo,
        updateItemList: updateItemList,
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
                        {React.cloneElement(deleteItem, {
                            ...deleteItem.props,
                            ...newProps,
                            onClose: onClose,
                        })}
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
