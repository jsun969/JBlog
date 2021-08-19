import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

export default function LogoutDialog({ open, onClose, onSure }: { open: boolean; onClose: () => void; onSure: () => void }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>确定登出后台?</DialogTitle>
      <DialogContent>
        <DialogContentText>登出后需要重新输入Key才能登陆</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          取消
        </Button>
        <Button onClick={onSure} color="primary" autoFocus>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
}
