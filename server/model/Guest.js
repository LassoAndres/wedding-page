
class Guest {
    id
    token
    type
    full_name
    email
    status
    meal_type
    celiac
    allergic
    allergy_comment
    has_children
    children
    has_plus_one
    with_plus_one
    plus_one_full_name
    plus_one_meal_type
    plus_one_celiac
    plus_one_allergic
    plus_one_allergy_comment

    static from(json) {
        return Object.assign(new Guest(), json);
    }
}

class GuestStatus {
    static get SENT() {
        return "SENT";
    }

    static get COMING() {
        return "COMING";
    }

    static get NOT_COMING() {
        return "NOT_COMING";
    }
}

class MealType {
    static get carnivorous() {
        return "carnivorous";
    }

    static get vegetarian() {
        return "vegetarian";
    }

    static get vegan() {
        return "vegan";
    }
}

module.exports = {
    Guest,
    GuestStatus,
    MealType
}