import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>登出后台?</DialogTitle>
      <DialogContent>
        <DialogContentText>登出后需要重新输入Key才能登陆</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          取消
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
