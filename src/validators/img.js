//function for image input validation//
export function validateInput(input) {
  const validationErrors = {}

  if (!('fileUrl' in input) || input['fileUrl'].length == 0) {
    validationErrors['fileUrl'] = 'invalid file'
  }

  if (!('price' in input) || input['price'].length == 0) {
    validationErrors['price'] = 'cannot be blank'
  }
    
  if (!('title' in input) || input['title'].length == 0) {
    validationErrors['title'] = 'cannot be blank'
  }

    if (!('description' in input) || input['description'].length == 0) {
      
  }

  return validationErrors;
}