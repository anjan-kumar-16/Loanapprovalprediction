def generate_insights(application, loan_status):

    insights = []
    recommendations = []

    # Credit score analysis
    if application.cibil_score >= 750:
        insights.append("Strong credit score.")
    elif application.cibil_score >= 650:
        insights.append("Credit score is acceptable but could be improved.")
        recommendations.append(
            "Improve your credit score by maintaining timely repayments."
        )
    else:
        insights.append("Low credit score increases lending risk.")
        recommendations.append(
            "Work on improving your credit score before applying again."
        )

    # Loan-to-income analysis
    if application.income_annum > 0:

        loan_income_ratio = (
            application.loan_amount / application.income_annum
        )

        if loan_income_ratio > 5:
            insights.append(
                "Loan amount is high compared with annual income."
            )
            recommendations.append(
                "Consider requesting a lower loan amount."
            )
        else:
            insights.append(
                "Loan amount is reasonable compared with annual income."
            )

    # Final risk assessment
    if loan_status.lower() == "approved":
        risk_level = "Low to Moderate"
        summary = (
            "The application shows characteristics "
            "that support loan approval."
        )
    else:
        risk_level = "Moderate to High"
        summary = (
            "The application contains factors "
            "that may increase lending risk."
        )

    return {
        "summary": summary,
        "risk_level": risk_level,
        "key_factors": insights,
        "recommendations": recommendations
    }