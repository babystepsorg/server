import { GlobalConfig } from "payload/types";

const Subheadings: GlobalConfig = {
	slug: "subheadings",
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					name: 'preconception',
					label: 'Preconception',
					fields: [
						{
							name: 'planner_description',
							label: 'Planner Descripion',
							type: 'text',
						},
						{
							name: 'symptoms_description',
							label: 'Symptoms Descripion',
							type: 'text',
						},
						{
							name: 'todo_description',
							label: 'Todo Descripion',
							type: 'text',
						},
						{
							name: 'content_description',
							label: 'Content Descripion',
							type: 'text',
						},
						{
							name: 'product_description',
							label: 'Product Descripion',
							type: 'text',
						},
						{
							name: 'specialist_description',
							label: 'Specialist Descripion',
							type: 'text',
						},
					]
				},
				{
					name: 'pregnancy',
					label: 'Pregnancy',
					fields: [
						{
							name: 'planner_description',
							label: 'Planner Descripion',
							type: 'text',
						},
						{
							name: 'symptoms_description',
							label: 'Symptoms Descripion',
							type: 'text',
						},
						{
							name: 'todo_description',
							label: 'Todo Descripion',
							type: 'text',
						},
						{
							name: 'content_description',
							label: 'Content Descripion',
							type: 'text',
						},
						{
							name: 'product_description',
							label: 'Product Descripion',
							type: 'text',
						},
						{
							name: 'specialist_description',
							label: 'Specialist Descripion',
							type: 'text',
						},
					]
				},
				{
					name: 'postpartum',
					label: "Postpartum",
					fields: [
						{
							name: 'planner_description',
							label: 'Planner Descripion',
							type: 'text',
						},
						{
							name: 'symptoms_description',
							label: 'Symptoms Descripion',
							type: 'text',
						},
						{
							name: 'todo_description',
							label: 'Todo Descripion',
							type: 'text',
						},
						{
							name: 'content_description',
							label: 'Content Descripion',
							type: 'text',
						},
						{
							name: 'product_description',
							label: 'Product Descripion',
							type: 'text',
						},
						{
							name: 'specialist_description',
							label: 'Specialist Descripion',
							type: 'text',
						}
					]
				}
			],
		}
	],
};

export default Subheadings;