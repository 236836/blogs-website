import Modal from './Modal.jsx'
import Button from './Button.jsx'

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    loading = false,
    variant = 'danger'
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
        >
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
            </p>
            <div className="flex gap-3 justify-end">
                <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={loading}
                >
                    {cancelText}
                </Button>
                <Button
                    variant={variant}
                    onClick={onConfirm}
                    loading={loading}
                >
                    {confirmText}
                </Button>
            </div>
        </Modal>
    )
}