const options: { mustInclude: string[]; response: string }[] = [
  {
    mustInclude: [
      "ecommerce_sub_category_category_id_ecommerce_category_id_fk",
      "update or delete",
    ],
    response:
      "This category has dependencies and cannot be deleted. Remove those dependencies first.",
  },
  {
    mustInclude: ["ecommerce_category_name_unique", "duplicate key"],
    response:
      "A category already exists with the same name. Please choose a different name.",
  },
];
export function CategoryMessageBuilder(message: string) {
  // Loop through the options to check if option[i].mustInclude is included in the message using a for-of loop and return option[i].response
  for (const option of options) {
    if (
      option.mustInclude.every((mustInclude) => message.includes(mustInclude))
    ) {
      return option.response;
    }
  }

  // If none of the options match, return the default response
  return message;
}
