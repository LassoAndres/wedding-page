import React from "react";
import {GuestStatus, MealType} from "../server/model/Guest";

export default class ConfirmationForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            guest: props.guest,
            apiError: false,
            submittingForm: false,
            submitted: [GuestStatus.COMING, GuestStatus.NOT_COMING].includes(props.guest.status),
        }

        this.buildPlusOneForm = this.buildPlusOneForm.bind(this)
        this.buildChildrenFrom = this.buildChildrenFrom.bind(this)
        this.handleChangeGuestInput = this.handleChangeGuestInput.bind(this)
        this.handleWithPlusOneChange = this.handleWithPlusOneChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.postSubmition = this.postSubmition.bind(this);
    }

    handleChangeGuestInput(e) {
        let newState = {guest: this.state.guest};
        if (e.target.type === "checkbox") {
            newState['guest'][e.target.name] = e.target.checked
        } else {
            newState['guest'][e.target.name] = e.target.value
        }
        this.setState(newState)
    }

    handleWithPlusOneChange(e) {
        this.handleChangeGuestInput(e)

        let fullNameInput = document.querySelector("#plus_one_full_name");
        let mealTypeInputs = document.querySelectorAll("[name=plus_one_meal_type]");
        if (e.target.checked) {
            fullNameInput.setAttribute("required", "")
            mealTypeInputs.forEach(input => input.setAttribute("required", ""))
        } else {
            fullNameInput.removeAttribute("required")
            mealTypeInputs.forEach(input => input.removeAttribute("required"))
        }
    }

    handleSubmit(e) {
        e.preventDefault()
        let form = e.target
        form.classList.remove('was-validated')

        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()

            form.classList.add('was-validated')
            return
        }

        this.postSubmition(GuestStatus.COMING)
    }

    postSubmition(status) {
        let guest = this.state.guest;
        guest.status = status
        guest.children = parseInt(guest.children)

        this.setState({ submittingForm: true, guest})

        fetch(`/api/guest/confirmation/${this.state.guest.token}`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json;charset=UTF-8' },
            body: JSON.stringify(this.state.guest)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseBody => {
            this.setState({submittingForm: false, submitted: true, guest: responseBody})
        })
        .catch(error => {
            this.setState({submittingForm: false, apiError: true})
        })
    }

    buildPlusOneForm() {
        return (<div>
            <div className="form-floating mb-3">
                <div className="form-check">
                    <input className="form-check-input" id="with_plus_one" name="with_plus_one" type="checkbox"
                           data-sb-validations="required" data-bs-toggle="collapse" href="#plus_one_group"
                           onChange={this.handleWithPlusOneChange} disabled={this.state.submitted}
                           checked={this.state.guest.with_plus_one}/>
                    <label className="form-check-label"> Llevo acompañante </label>
                </div>
            </div>
            <div id="plus_one_group" className={this.state.guest.with_plus_one ? "collapse.show" : "collapse"}>
                <div className="form-floating mb-3">
                    <input className="form-control" id="plus_one_full_name" name="plus_one_full_name" type="text"
                           placeholder="Nombre completo de tu acompañante" data-sb-validations="required"
                           onChange={this.handleChangeGuestInput} value={this.state.guest.plus_one_full_name}
                           disabled={this.state.submitted}/>
                    <label htmlFor="plus_one_full_name">Nombre completo de tu acompañante</label>
                    <div className="invalid-feedback" data-sb-feedback="plus_one_full_name:required">A name is required.</div>
                </div>

                {/** Meal type */}
                <div className="mb-3">
                    <label className="form-label form-check-inline">¿Tu acompañante come carne?</label>
                    <div className="form-check ms-4">
                        <input className="form-check-input" type="radio" name="plus_one_meal_type"
                               id="plus_one_meal_type_carnivorous" value={MealType.carnivorous}
                               onChange={this.handleChangeGuestInput}
                               checked={this.state.guest.plus_one_meal_type === MealType.carnivorous}
                               disabled={this.state.submitted}/>
                        <label className="form-check-label" htmlFor="plus_one_meal_type_carnivorous">Si 🥩</label>
                    </div>
                    <div className="form-check ms-4">
                        <input className="form-check-input" type="radio" name="plus_one_meal_type"
                               id="plus_one_meal_type_vegetarian" value={MealType.vegetarian}
                               onChange={this.handleChangeGuestInput}
                               checked={this.state.guest.plus_one_meal_type === MealType.vegetarian}
                               disabled={this.state.submitted}/>
                        <label className="form-check-label" htmlFor="plus_one_meal_type_vegetarian">No, es vegetariano 🍳</label>
                    </div>
                    <div className="form-check ms-4">
                        <input className="form-check-input" type="radio" name="plus_one_meal_type"
                               id="plus_one_meal_type_vegan" value={MealType.vegan}
                               onChange={this.handleChangeGuestInput}
                               checked={this.state.guest.plus_one_meal_type === MealType.vegan}
                               disabled={this.state.submitted}/>
                        <label className="form-check-label" htmlFor="plus_one_meal_type_vegan">No, es vegano 🥗</label>
                    </div>
                </div>

                <div className="form-floating mb-3">
                    <div className="form-check">
                        <input className="form-check-input" id="plus_one_celiac" name="plus_one_celiac" type="checkbox"
                               onChange={this.handleChangeGuestInput} disabled={this.state.submitted}
                               checked={this.state.guest.plus_one_celiac}/>
                        <label className="form-check-label"> Mi acompañante es celiaco 🌾</label>
                    </div>
                </div>

                {/** Alergias */}
                <div className="form-floating mb-3">
                    <div className="form-check">
                        <input className="form-check-input" id="plus_one_allergic" name="plus_one_allergic" type="checkbox"
                               data-bs-toggle="collapse" href="#po_allergy_comment_group" onChange={this.handleChangeGuestInput}
                               disabled={this.state.submitted} checked={this.state.guest.plus_one_allergic}/>
                        <label className="form-check-label"> Mi acompañante es alérgico/a a algún alimento o
                            bebida </label>
                    </div>
                </div>
                <div id="po_allergy_comment_group"
                     className={"form-floating  mb-3 collapse" + (this.state.guest.plus_one_allergy_comment ? ".show" : "")}>
                    <textarea className="form-control" id="plus_one_allergy_comment" name="plus_one_allergy_comment"
                              placeholder="Contame a qué es alergico/a" onChange={this.handleChangeGuestInput}
                              defaultValue={this.state.guest.plus_one_allergy_comment} disabled={this.state.submitted}></textarea>
                    <label htmlFor="plus_one_allergy_comment">¿A qué es alégico/a?</label>
                </div>
            </div>
        </div>)
    }

    buildChildrenFrom(default_value) {
        return (<div className="form-floating mb-3">
            <select className="form-select" id="children" name="children" type="select" defaultValue={default_value}
                    onChange={this.handleChangeGuestInput} required disabled={this.state.submitted}>
                <option value="0">No voy con niños</option>
                <option value="1"> Uno </option>
                <option value="2"> Dos </option>
                <option value="3"> Tres </option>
                <option value="4"> Cuatro </option>
            </select>

            <label htmlFor="children">Menú para niños/as</label>
        </div>)
    }

    render() {
        const {guest} = this.props

        let plusOneForm = ""
        if (guest.has_plus_one) {
            plusOneForm = this.buildPlusOneForm()
        }

        let childrenFrom = ""
        if (guest.has_children) {
            childrenFrom = this.buildChildrenFrom(guest.children)
        }

        return (<form className="needs-validation" id="confirmationForm" onSubmit={this.handleSubmit} noValidate>
            {/** Name input */}
            <div className="form-floating mb-3">
                <input className="form-control" id="full_name" name="full_name" type="text"  required
                       defaultValue={this.state.guest.full_name} onChange={this.handleChangeGuestInput}
                       disabled={this.state.submitted} placeholder="Escribe tu nombre completo"/>
                <label htmlFor="full_name">Nombre completo</label>
                <div className="invalid-feedback">Completá con tu nombre y apellido</div>
            </div>

            {/** Email address input */}
            <div className="form-floating mb-3">
                <input className="form-control" id="email" name="email" type="email" required
                       defaultValue={this.state.guest.email} onChange={this.handleChangeGuestInput}
                       disabled={this.state.submitted} placeholder="Escribe tu correo electrónico"/>
                <label htmlFor="email">Correo electrónico</label>
                <div className="invalid-feedback" data-sb-feedback="email:required">An email is required.</div>
                <div className="invalid-feedback" data-sb-feedback="email:email">Email is not valid.</div>
            </div>
            {/** Meal type */}
            <div className="mb-3">
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="meal_type" required
                           id="meal_type_carnivorous" value={MealType.carnivorous} onChange={this.handleChangeGuestInput}
                           checked={this.state.guest.meal_type===MealType.carnivorous} disabled={this.state.submitted}/>
                    <label className="form-check-label" htmlFor="meal_type_carnivorous">Como carne 🥩</label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="meal_type" required
                           id="meal_type_vegetarian" value={MealType.vegetarian} onChange={this.handleChangeGuestInput}
                           checked={this.state.guest.meal_type===MealType.vegetarian} disabled={this.state.submitted}/>
                    <label className="form-check-label" htmlFor="meal_type_vegetarian">Soy vegetariano 🍳</label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="meal_type" required
                           id="meal_type_vegan" value={MealType.vegan} onChange={this.handleChangeGuestInput}
                           checked={this.state.guest.meal_type===MealType.vegan} disabled={this.state.submitted}/>
                    <label className="form-check-label" htmlFor="meal_type_vegan">Soy vegano 🥗</label>
                    <div className="invalid-feedback">Completá que tipo de comida comés</div>
                </div>
            </div>
            <div className="form-floating mb-3">
                <div className="form-check">
                    <input className="form-check-input" id="celiac" name="celiac" type="checkbox"
                           checked={this.state.guest.celiac} onChange={this.handleChangeGuestInput}
                           disabled={this.state.submitted}/>
                    <label className="form-check-label"> Soy celiaco 🌾</label>
                </div>
            </div>
            {/** Alergias */}
            <div className="form-floating mb-3">
                <div className="form-check">
                    <input className="form-check-input" id="allergic" name="allergic" type="checkbox"
                           data-bs-toggle="collapse" href="#allergy_comment_group" onChange={this.handleChangeGuestInput}
                           checked={this.state.guest.allergic} disabled={this.state.submitted}/>
                    <label className="form-check-label"> Soy alérgico 🤧 a algún alimento o bebida </label>
                </div>
            </div>
            <div id="allergy_comment_group" className={"form-floating  mb-3 collapse" + (this.state.guest.allergic ? ".show" : "")}>
                <textarea className="form-control" id="allergy_comment" name="allergy_comment"
                          placeholder="Contame a qué sos alergico" onChange={this.handleChangeGuestInput}
                          defaultValue={this.state.guest.allergy_comment} disabled={this.state.submitted}></textarea>
                <label htmlFor="allergy_comment">¿A qué sos alégico?</label>
            </div>

            {/** Menores */}
            {childrenFrom}

            {/** Acompañante */}
            {plusOneForm}

            {/**
                Submit success message
                This is what your users will see when the form has successfully submitted
             */}
            <div className={this.state.submitted && this.state.guest.status === GuestStatus.COMING ? "" : "d-none"} >
                <div className="text-center mb-3">
                    <div className="fw-bolder">¡Ya confirmaste, te esperamos!</div>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a nisl ultrices, ornare tellus ut, gravida neque.
                        Fusce non sapien blandit, gravida tellus in, placerat ligula.
                    </p>
                </div>
            </div>

            <div className={this.state.submitted && this.state.guest.status === GuestStatus.NOT_COMING ? "" : "d-none"} >
                <div className="text-center mb-3">
                    <div className="fw-bolder">Ouh ¡Que lástima!</div>
                </div>
            </div>

            {/**
                Submit error message
                This is what your users will see when there is an error submitting the form
             */}
            <div className="d-none" id="submitErrorMessage">
                <div className="text-center text-danger mb-3">Error sending message!</div>
            </div>

            {/** Submit Button */}
            { this.state.submitted ? "" : (
                <div className="d-grid gap-2">
                    <button className="btn btn-primary btn-xl" type="submit" disabled={this.state.submittingForm}>
                        {
                            this.state.submittingForm && this.state.guest.status === GuestStatus.COMING ?
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                : "¡Cuenten conmigo!"
                        }
                    </button>
                    <button className="btn btn-secondary btn-xl " type="button" disabled={this.state.submittingForm}
                            onClick={_ => this.postSubmition(GuestStatus.NOT_COMING)}>
                        {
                            this.state.submittingForm && this.state.guest.status === GuestStatus.NOT_COMING ?
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                : "Me lo pierdo 😔"
                        }
                    </button>
                </div>
            )}
        </form>)
    }

}