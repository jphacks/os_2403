package models

type Tag struct {
	ID    uint
	Name  string
	Color string
}

func NewTag(name string) *Tag {
	return &Tag{
		Name:  name,
		Color: "red", // デフォルト値
	}
}

type Tags []Tag
