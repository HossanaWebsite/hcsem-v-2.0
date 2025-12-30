import { z } from "zod";

// Contact Form Schema
export const contactSchema = z.object({
    selectedReason: z.string().min(1, "Please select a reason"),
    customReason: z.string().optional(),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    Address: z.string().optional(),
    company_name: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().regex(/^\d*$/, "Zip code must be digits").optional(),
    email: z.string().email("Invalid email").optional(),
    phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, "Phone must be in format 123-456-7890"),
    form_order_notes: z.string().optional(),
}).refine((data) => {
    if (data.selectedReason === "Other") {
        return data.customReason && data.customReason.trim() !== "";
    }
    return true;
}, {
    message: "Please specify the reason",
    path: ["customReason"],
});
