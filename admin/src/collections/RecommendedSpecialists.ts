import { CollectionConfig } from "payload/types";

const RecommendedSpecialists: CollectionConfig = {
    slug: 'recommended-specialists',
    access: {
        read: () => true,
        create: () => true,
    },
    fields: [
        {
            type: 'text',
            name: 'name',
            admin: {
                readOnly: true
            }
        },
        {
            type: 'text',
            name: 'expertise',
            admin: {
                readOnly: true
            }
        },
        {
            type: 'text',
            name: 'user_id',
            label: "User ID",
            admin: {
                readOnly: true
            }
        }
    ]
}

export default RecommendedSpecialists
