from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app


def test_register_login_habit_and_check_in_flow():
    email = f"elif.flow.{uuid4().hex}@example.com"

    with TestClient(app) as client:
        register_response = client.post(
            "/api/auth/register",
            json={
                "name": "Elif Test",
                "email": email,
                "password": "StrongPass123",
            },
        )
        assert register_response.status_code == 201
        token = register_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        login_response = client.post(
            "/api/auth/login",
            json={"email": email, "password": "StrongPass123"},
        )
        assert login_response.status_code == 200

        habit_response = client.post(
            "/api/habits",
            headers=headers,
            json={
                "title": "Kitap oku",
                "goal_text": "Her gun 20 dakika kitap oku",
                "frequency": "daily",
                "preferred_time": "evening",
                "identity_text": "Ben kitap okuyan biriyim",
            },
        )
        assert habit_response.status_code == 201
        habit_id = habit_response.json()["id"]

        habits_response = client.get("/api/habits", headers=headers)
        assert habits_response.status_code == 200
        assert len(habits_response.json()) == 1

        check_in_response = client.post(
            "/api/check-ins",
            headers=headers,
            json={
                "habit_id": habit_id,
                "check_date": "2026-07-03",
                "status": "done",
                "mood_score": 8,
                "note": "Iyi gitti",
            },
        )
        assert check_in_response.status_code == 201

        check_ins_response = client.get("/api/check-ins", headers=headers)
        assert check_ins_response.status_code == 200
        assert len(check_ins_response.json()) == 1


def test_check_in_mood_score_validation():
    email = f"elif.flow.{uuid4().hex}@example.com"

    with TestClient(app) as client:
        # Register and Login
        register_response = client.post(
            "/api/auth/register",
            json={"name": "Elif Validation Test", "email": email, "password": "StrongPass123"},
        )
        assert register_response.status_code == 201
        token = register_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Create Habit
        habit_response = client.post(
            "/api/habits",
            headers=headers,
            json={
                "title": "Meditasyon",
                "frequency": "daily",
            },
        )
        assert habit_response.status_code == 201
        habit_id = habit_response.json()["id"]

        # Test Case 1: mood_score is less than 1 (0) - Should return 422 Unprocessable Entity
        response = client.post(
            "/api/check-ins",
            headers=headers,
            json={
                "habit_id": habit_id,
                "check_date": "2026-07-04",
                "status": "done",
                "mood_score": 0,
            },
        )
        assert response.status_code == 422

        # Test Case 2: mood_score is greater than 10 (11) - Should return 422 Unprocessable Entity
        response = client.post(
            "/api/check-ins",
            headers=headers,
            json={
                "habit_id": habit_id,
                "check_date": "2026-07-04",
                "status": "done",
                "mood_score": 11,
            },
        )
        assert response.status_code == 422

        # Test Case 3: mood_score provided when status is "missed" - Should return 400 Bad Request
        response = client.post(
            "/api/check-ins",
            headers=headers,
            json={
                "habit_id": habit_id,
                "check_date": "2026-07-04",
                "status": "missed",
                "mood_score": 5,
            },
        )
        assert response.status_code == 400
        assert "Mood score is only saved for done habits" in response.json()["detail"]

        # Test Case 4: Valid check-in with mood_score 10
        response = client.post(
            "/api/check-ins",
            headers=headers,
            json={
                "habit_id": habit_id,
                "check_date": "2026-07-04",
                "status": "done",
                "mood_score": 10,
            },
        )
        assert response.status_code == 201
        assert response.json()["mood_score"] == 10

