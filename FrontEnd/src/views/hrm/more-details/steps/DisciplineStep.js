import { useEffect } from "react";

import {
    getEmployeeDiscipline,
    createEmployeeDiscipline,
    updateEmployeeDiscipline
} from "../../../../services/employeeDiscipline";

const DisciplineStep = ({ state, dispatch, employeeId }) => {

    const { disciplines } = state;


    useEffect(() => {

        const loadDisciplines = async () => {

            try {

                const res = await getEmployeeDiscipline(employeeId);

                dispatch({
                    type: "SET_DISCIPLINES",
                    payload: res.data.data?.length
                        ? res.data.data
                        : [{
                            offence: "",
                            offence_date: "",
                            disciplinary_action: "",
                            remarks: ""
                        }]
                });

            } catch (err) {
                console.error(err);
            }

        };

        loadDisciplines();

    }, [employeeId]);



    const handleChange = (index, field, value) => {

        dispatch({
            type: "UPDATE_ITEM",
            section: "disciplines",
            index,
            field,
            value
        });

    };


    const saveDiscipline = async (discipline, index) => {

        try {

            if (discipline.id) {

                await updateEmployeeDiscipline(
                    employeeId,
                    discipline.id,
                    discipline
                );

            } else {

                const res = await createEmployeeDiscipline(
                    employeeId,
                    discipline
                );

                dispatch({
                    type: "UPDATE_ITEM",
                    section: "disciplines",
                    index,
                    field: "id",
                    value: res.data.data.id
                });

            }

        } catch (err) {
            console.error(err);
        }

    };


    const handleNext = async () => {

        const validRecords = disciplines.filter(
            d => d.offence || d.disciplinary_action
        );

        for (let i = 0; i < validRecords.length; i++) {
            await saveDiscipline(validRecords[i], i);
        }

        dispatch({
            type: "SET_STEP",
            payload: state.step + 1
        });

    };


    return (

        <div className="step-content">

            <div className="card shadow-sm">

                <div className="card-header bg-light fw-semibold">
                    Employee Discipline Records
                </div>

                <div className="card-body">

                    {disciplines.map((discipline, index) => (

                        <div key={index} className="border rounded p-3 mb-3">

                            <div className="row g-3">

                                <div className="col-md-4">
                                    <label className="form-label">Offence</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={discipline.offence || ""}
                                        onChange={(e) =>
                                            handleChange(index, "offence", e.target.value)
                                        }
                                    />
                                </div>


                                <div className="col-md-4">
                                    <label className="form-label">Offence Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={discipline.offence_date || ""}
                                        onChange={(e) =>
                                            handleChange(index, "offence_date", e.target.value)
                                        }
                                    />
                                </div>


                                <div className="col-md-4">
                                    <label className="form-label">Disciplinary Action</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={discipline.disciplinary_action || ""}
                                        onChange={(e) =>
                                            handleChange(index, "disciplinary_action", e.target.value)
                                        }
                                    />
                                </div>


                                <div className="col-md-12">
                                    <label className="form-label">Remarks</label>
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        value={discipline.remarks || ""}
                                        onChange={(e) =>
                                            handleChange(index, "remarks", e.target.value)
                                        }
                                    />
                                </div>

                            </div>


                            {disciplines.length > 1 && (

                                <div className="text-end mt-2">

                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() =>
                                            dispatch({
                                                type: "REMOVE_ITEM",
                                                section: "disciplines",
                                                index
                                            })
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            )}

                        </div>

                    ))}


                    <button
                        className="btn btn-outline-primary"
                        onClick={() =>
                            dispatch({
                                type: "ADD_ITEM",
                                section: "disciplines",
                                payload: {
                                    offence: "",
                                    offence_date: "",
                                    disciplinary_action: "",
                                    remarks: ""
                                }
                            })
                        }
                    >
                        + Add Record
                    </button>

                </div>

            </div>



            <div className="d-flex justify-content-end gap-2 mt-4">

                <button
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        dispatch({
                            type: "SET_STEP",
                            payload: state.step - 1
                        })
                    }
                >
                    Previous
                </button>

                <button
                    className="btn btn-primary"
                    onClick={handleNext}
                >
                    Save & Next
                </button>

            </div>

        </div>

    );

};

export default DisciplineStep;