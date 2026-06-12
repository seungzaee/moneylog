from uuid import UUID

from sqlalchemy.orm import Session

from app.models.category import Category


def create_category(db: Session, user_id: UUID, name: str) -> Category:
    category = Category(
        user_id=user_id,
        name=name,
    )

    db.add(category)
    db.commit()
    db.refresh(category)

    return category


def get_categories_by_user_id(db: Session, user_id: UUID) -> list[Category]:
    return (
        db.query(Category)
        .filter(Category.user_id == user_id)
        .order_by(Category.created_at.desc())
        .all()
    )


def get_category_by_name_and_user_id(
    db: Session,
    user_id: UUID,
    name: str,
) -> Category | None:
    return (
        db.query(Category)
        .filter(Category.user_id == user_id, Category.name == name)
        .first()
    )