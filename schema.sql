CREATE TABLE IF NOT EXISTS loan_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    no_of_dependents INT,
    education VARCHAR(50),
    employment_type VARCHAR(50),
    income_annum BIGINT,
    loan_amount BIGINT,
    loan_term INT,
    cibil_score INT,
    bank_asset_value BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);