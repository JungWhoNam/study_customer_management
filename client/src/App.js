import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import './App.css';
import Customer from './components/Customer';
import CustomerAdd from './components/CustomerAdd';

// add CSS styles
const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 1080
  },
  progress: {
    margin: theme.spacing(2)
  }
});

// React life-cycle
// 1) constructor
// 2) componentWillMount()
// 3) render()
// 4) componentDidMount()
// 상태변화) shouldComponentUpdate()
// component 삭제) componentWillUnmount()

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      customers: "",
      completed: 0 // 0~100
    };
  }

  stateRefresh = () => {
    this.setState({
      customers: "",
      completed: 0
    });
    this.callApi()
      .then(res => this.setState({ customers: res }))
      .catch(err => console.log(err));
  }

  componentDidMount() {
    // 100ms (0.1s) 마다 progress 함수가 콜
    // 콜되는 시간이 너무 빠르면 progress bar가 이상하게 작동
    this.timer = setInterval(this.progress, 100);
    // fetch data from the server
    this.callApi()
      .then(res => this.setState({ customers: res }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const res = await fetch('/api/customers');
    const body = await res.json();
    return body;
  }

  // state에서 completed 변수 1씩 증가... 100 이상이 되면 0으로 리셋
  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 })
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    // 위에서 적용한 styles를 사용하기 위해 classes 변수 선언
    const { classes } = this.props;
    return (
      <div>
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
              {
                this.state.customers ?
                  this.state.customers.map(c => {
                    return <Customer key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job} />
                  }) :
                  <TableRow>
                    <TableCell colSpan="6" align="center">
                      <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed} />
                    </TableCell>
                  </TableRow>
              }
            </TableBody>
          </Table>
        </Paper>
        <CustomerAdd stateRefresh={this.stateRefresh}/>
      </div>
    );
  }
}

// https://material-ui.com/styles/basics/
// material ui에서 style 적용하는 세가지 방법중 higher-oder compoent api 방식 사용
export default withStyles(styles)(App);