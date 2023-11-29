import { CollectionConfig } from "payload/types";

const RecommendedProducts: CollectionConfig = {
    slug: 'recommended-products',
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
            name: 'brand',
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

export default RecommendedProducts
