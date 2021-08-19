import { Paper, Grid, TextField, Button } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  loginPaper: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
  },
}));

export default function LoginForm({
  passKey,
  onChangeKey,
  onLogin,
  disabled,
}: {
  passKey: string;
  onChangeKey: (value: string) => void;
  onLogin: () => any;
  disabled: boolean;
}) {
  const classes = useStyles();

  return (
    <Paper className={classes.loginPaper}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            placeholder="后台KEY"
            fullWidth
            type="password"
            inputProps={{ maxLength: 30 }}
            value={passKey}
            onChange={(event) => {
              onChangeKey(event.target.value);
            }}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                onLogin();
              }
            }}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth onClick={onLogin} disabled={disabled}>
            登陆
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
