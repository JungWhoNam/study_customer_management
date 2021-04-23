import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Customer from './components/Customer';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

// add CSS styles
const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 1080
  }
});

class App extends React.Component {

  state = {
    customers: ""
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ customers: res }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const res = await fetch('/api/customers');
    const body = await res.json();
    return body;
  }


  render() {
    // 위에서 적용한 styles를 사용하기 위해 classes 변수 선언
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>이미지</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>생년월일</TableCell>
              <TableCell>성별</TableCell>
              <TableCell>직업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.customers ? this.state.customers.map(c => {
                return <Customer key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job} />
              }) : ""
            }
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

//https://material-ui.com/styles/basics/
// material ui에서 style 적용하는 세가지 방법중 higher-oder compoent api 방식 사용
export default withStyles(styles)(App);