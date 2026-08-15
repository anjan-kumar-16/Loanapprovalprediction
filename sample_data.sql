USE loan_approval_db;

INSERT INTO loan_applications (
    no_of_dependents,
    education,
    employment_type,
    income_annum,
    loan_amount,
    loan_term,
    cibil_score,
    bank_asset_value
)
VALUES (
    2,
    'Graduate',
    'Salaried',
    500000,
    1500000,
    10,
    750,
    1000000
);