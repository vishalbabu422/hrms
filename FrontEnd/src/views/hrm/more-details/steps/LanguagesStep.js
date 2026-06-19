import {
    CButton,
    CFormInput,
    CFormCheck,
    CFormSelect
} from "@coreui/react";

import { useEffect } from "react";

import {
    getEmployeeLanguages,
    createEmployeeLanguage,
    updateEmployeeLanguage
} from "../../../../services/employeeLanguages";


const LanguagesStep = ({ state, dispatch, employeeId }) => {

    const { languages } = state;

    useEffect(() => {

        const loadLanguages = async () => {

            try {

                const res = await getEmployeeLanguages(employeeId)

                dispatch({
                    type: "SET_LANGUAGES",
                    payload: res.data.data?.length
                        ? res.data.data
                        : [{
                            language_name: "",
                            can_read: false,
                            can_write: false,
                            can_speak: false,
                            proficiency: ""
                        }]
                })

            } catch (err) {
                console.error(err)
            }

        }

        loadLanguages()

    }, [employeeId])


    const saveLanguage = async (language, index) => {

        try {

            let res;

            if (language.id) {

                res = await updateEmployeeLanguage(
                    employeeId,
                    language.id,
                    language
                )

            } else {

                res = await createEmployeeLanguage(
                    employeeId,
                    language
                )

                dispatch({
                    type: "UPDATE_ITEM",
                    section: "languages",
                    index: index,
                    field: "id",
                    value: res.data.data.id
                })

            }

        } catch (err) {
            console.error(err)
        }

    }


    const handleNext = async () => {

        const validLanguages = languages.filter(
            l => l.language_name
        )

        for (let i = 0; i < validLanguages.length; i++) {
            await saveLanguage(validLanguages[i], i)
        }

        dispatch({
            type: "SET_STEP",
            payload: state.step + 1
        })

    }


    return (

        <div className="step-content">

            <h5 className="mb-3">Languages Known</h5>

            {languages.map((language, index) => (

                <div key={index} className="border rounded p-3 mb-3">

                    <div className="row g-3">

                        <div className="col-md-4">
                            <CFormInput
                                label="Language"
                                placeholder="e.g. English, Hindi"
                                value={language.language_name}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "languages",
                                        index: index,
                                        field: "language_name",
                                        value: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="col-md-4">
                            <CFormSelect
                                label="Proficiency"
                                value={language.proficiency}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "languages",
                                        index: index,
                                        field: "proficiency",
                                        value: e.target.value
                                    })
                                }
                            >
                                <option value="">Select</option>
                                <option value="Basic">Basic</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Fluent">Fluent</option>
                                <option value="Native">Native</option>
                            </CFormSelect>
                        </div>

                        <div className="col-md-4 d-flex align-items-end">

                            <div className="d-flex gap-3">

                                <CFormCheck
                                    label="Read"
                                    checked={language.can_read || false}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "UPDATE_ITEM",
                                            section: "languages",
                                            index: index,
                                            field: "can_read",
                                            value: e.target.checked
                                        })
                                    }
                                />

                                <CFormCheck
                                    label="Write"
                                    checked={language.can_write || false}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "UPDATE_ITEM",
                                            section: "languages",
                                            index: index,
                                            field: "can_write",
                                            value: e.target.checked
                                        })
                                    }
                                />

                                <CFormCheck
                                    label="Speak"
                                    checked={language.can_speak || false}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "UPDATE_ITEM",
                                            section: "languages",
                                            index: index,
                                            field: "can_speak",
                                            value: e.target.checked
                                        })
                                    }
                                />

                            </div>

                        </div>

                    </div>

                    {languages.length > 1 && (

                        <div className="text-end mt-2">

                            <CButton
                                color="danger"
                                size="sm"
                                onClick={() =>
                                    dispatch({
                                        type: "REMOVE_ITEM",
                                        section: "languages",
                                        index: index
                                    })
                                }
                            >
                                Remove
                            </CButton>

                        </div>

                    )}

                </div>

            ))}

            <CButton
                className="btn btn-outline-primary"
                onClick={() =>
                    dispatch({
                        type: "ADD_ITEM",
                        section: "languages",
                        payload: {
                            language_name: "",
                            can_read: false,
                            can_write: false,
                            can_speak: false,
                            proficiency: ""
                        }
                    })
                }
            >
                + Add Language
            </CButton>


            <div className="d-flex justify-content-end gap-2 mt-4">

                <CButton
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        dispatch({
                            type: "SET_STEP",
                            payload: state.step - 1
                        })
                    }
                >
                    Previous
                </CButton>

                <CButton
                    color="primary"
                    className="btn btn-primary"
                    onClick={handleNext}
                >
                    Save & Next
                </CButton>

            </div>

        </div>

    )

}

export default LanguagesStep;