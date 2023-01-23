import React from "react";

export default class TokenForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {token: "", loading: false, isValid: true, apiError: false}

        this.handleTokenChange = this.handleTokenChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTokenChange(e) {
        this.setState({token: e.target.value, isValid: true})
    }

    checkFormValidations() {
        return this.state.token != null && this.state.token.length > 3
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({loading: true, isValid: true, apiError: false})
        if (this.checkFormValidations()) {
            fetch(`/api/guest/validate-token/${this.state.token}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error(response.statusText);
                })
                .then(responseBody =>{
                    if (responseBody.isAuthenticated) {
                        this.props.onSuccessAuth();
                    } else {
                        this.setState({loading: false, isValid: false})
                    }
                })
                .catch(error => {
                    this.setState({loading: false, isValid: false, apiError: true})
                })
        } else {
            this.setState({loading: false, isValid: false})
        }
    }

    render() {
        let validationFeedbackMessage = this.state.apiError ? "Ocurrió un error al validar el código" : "Código inválido";

        return (<form onSubmit={this.handleSubmit}>
            <div className="input-group has-validation">
                <input className={`form-control ${!this.state.isValid ? "is-invalid" : ""}`} type="text"
                       defaultValue={this.state.token}
                       onChange={this.handleTokenChange}
                       placeholder="Código invitado"/>
                <button className="btn btn-secondary" type="submit" onClick={this.handleSubmit} disabled={this.state.loading}>
                    {
                        this.state.loading ?
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        : "Entrar"
                    }
                </button>
                <div id="tokenValidation" className="invalid-feedback fw-semibold">{validationFeedbackMessage}</div>
            </div>
        </form>)
    }
}