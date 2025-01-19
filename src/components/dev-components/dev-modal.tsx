//TSX code 
import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";
/*//  dev-Modal css animation 
.Modal-Overlay {
  animation: modal-overlayShow 400ms cubic-bezier(0.16, 1, 0.3, 1);
}
.Modal-Content {
  animation: modal-contentShow 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-overlayShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes modal-contentShow {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}*/

type ModalProps = {
  title?: string;
  children: React.ReactNode;
  modalBtn: React.ReactNode;
  closeIcon?: boolean;
  contentProps?: React.ComponentProps<typeof Dialog.Content>;
  customCloseIcon?: React.ReactNode;
} & React.ComponentProps<typeof Dialog.Root>;

export const ModalTrigger = ({ children }: { children: React.ReactNode }) => {
  return <Dialog.Trigger asChild>{children}</Dialog.Trigger>;
};
const DevModal = ({
  title,
  children,
  modalBtn,
  closeIcon = true,
  contentProps,
  customCloseIcon,
  ...props
}: ModalProps) => {
  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger asChild>{modalBtn}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="Modal-Overlay inset-0 fixed bg-black/50 blur-sm z-50" />
        <Dialog.Content
          {...contentProps}
          className={`Modal-Content md:w-auto w-[95vw] md:min-w-[400px] overflow-auto max-w-screen max-h-screen fixed z-50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-primary dark:bg-primary border border-accent/30  ${contentProps?.className}`}
        >
          {(closeIcon || title) && (
            <div className="flex items-start justify-end w-full p-2 border-b border-accent/40 bg-accent/20">
              {title && (
                <Dialog.Title className="flex-grow font-semibold text-black">
                  {title}
                </Dialog.Title>
              )}
              {closeIcon && !customCloseIcon && (
                <Dialog.Close className="aspect-square transition-all p-0.5 rounded-md ring ring-accent/20 active:ring-accent/50">
                  <IoMdClose />
                </Dialog.Close>
              )}
              {customCloseIcon && customCloseIcon}
            </div>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DevModal;
