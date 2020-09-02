// import React from "react";
// import LoginMenu from "./LoginMenu";

// function Header() {
//   return (
//     <div className="flex header-wrap">
//       <div className="logo">
//         <h2>Biller</h2>
//       </div>
//       <div className="nav-right">
//         <LoginMenu />
//       </div>
//     </div>
//   );
// }

// export default Header;

import React from "react";
import LoginMenu from "./LoginMenu";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';

// const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // width: `calc(100% - ${drawerWidth}px)`,
    // marginLeft: drawerWidth,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" className={classes.title}>
            Biller
          </Typography>
          <LoginMenu />
        </Toolbar>
      </AppBar>
    </div>
  );
}
