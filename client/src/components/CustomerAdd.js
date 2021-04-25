import React from 'react';
import { post } from 'axios';

class CustomerAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            userName: '',
            birthday: '',
            gender: '',
            job: '',
            fileName: ''
        }
    }

    handleFileChange = (e) => {
        this.setState({
            file: e.target.files[0],
            fileName: e.target.value
        });
    }

    handleValueChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleFormSubmit = (e) => {
        e.preventDefault();

        this.addCustomer().then((res) => {
            console.log(res.data);
            this.props.stateRefresh();
        }).catch((err) => {
            console.log(err);
            this.props.stateRefresh();
        });

        this.setState({
            file: null,
            userName: '',
            birthday: '',
            gender: '',
            job: '',
            fileName: ''
        });
    }

    addCustomer = () => {
        const url = '/api/customers';

        let formData = new FormData();
        formData.append('image', this.state.file);
        formData.append('name', this.state.userName);
        formData.append('birthday', this.state.birthday);
        formData.append('gender', this.state.gender);
        formData.append('job', this.state.job);
        // FormData 값을 로깅하려면 엔트리 값을 iterate하면서 로깅해야함
        // for (let key of formData.entries()) {
        //     console.log(key);
        // }

        return post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    render() {
        return (
            <form onSubmit={this.handleFormSubmit}>
                <h1>고객 추가</h1>
                프로필 이미지: <input type="file" name="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange} /><br />
                이름: <input type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange} /><br />
                생년월일: <input type="text" name="birthday" value={this.state.birthday} onChange={this.handleValueChange} /><br />
                성별: <input type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange} /><br />
                직업: <input type="text" name="job" value={this.state.job} onChange={this.handleValueChange} /><br />
                <button type="submit">추가하기</button>
            </form>
        )
    };
}

export default CustomerAdd;