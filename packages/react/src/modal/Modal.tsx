import React, { createContext, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cl } from '../utils';
import { modal, ModalTheme } from '@recastui/themes';

export type ModalContextProps = ModalTheme & {
	isOpen: boolean;
	onClose: () => void;
	closeOnOverlayClick?: boolean;
	blockScrollOnMount?: boolean;
	autoFocus?: boolean;
	initialFocusRef?: React.RefObject<HTMLElement>;
	finalFocusRef?: React.RefObject<HTMLElement>;
};

export const ModalContext = createContext<ModalContextProps>({
	isOpen: false,
	onClose: () => {},
});

export type ModalProps = ModalContextProps & {
	children: React.ReactNode;
	isCentered?: boolean;
	className?: string;
};

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	closeOnOverlayClick = true,
	blockScrollOnMount = true,
	autoFocus = true,
	isCentered,
	initialFocusRef,
	finalFocusRef,
	size,
	children,
	className,
}) => {
	if (!isOpen) return null;
	const overlayRef = useRef<HTMLDivElement>(null);
	const handleOverlayClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (closeOnOverlayClick && e.target === e.currentTarget) {
				onClose();
			}
		},
		[closeOnOverlayClick, onClose],
	);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [onClose]);

	return createPortal(
		<ModalContext.Provider
			value={{
				isOpen,
				onClose,
				closeOnOverlayClick,
				blockScrollOnMount,
				autoFocus,
				initialFocusRef,
				finalFocusRef,
				size,
			}}>
			<div className={cl(modal.overlay({ isCentered, className }))} onClick={handleOverlayClick}>
				{children}
			</div>
		</ModalContext.Provider>,
		document.body,
	);
};

Modal.displayName = 'Modal';
