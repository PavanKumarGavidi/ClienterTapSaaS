# Phase 5 — Documents Implementation

## ✅ What's Been Built

Phase 5 delivers a comprehensive document management system with e-signatures and intake forms.

### Document Management

#### Documents Tab
- **List view** with status badges (draft/sent/viewed/signed/declined)
- **Create new document** with title, type, client, template selection
- **Document types**: Proposal, Contract, Quotation, NDA, Other
- **Document editor** with HTML content support
- **Merge fields** auto-replaced in preview: `{{client_name}}`, `{{company}}`, `{{agency_name}}`, `{{date}}`, `{{amount}}`, `{{scope}}`, `{{timeline}}`
- **Version tracking** — auto-incremented on each save
- **Print/PDF export** via browser print dialog

#### Templates Tab
- **Template library** with 3 default templates:
  - Service Agreement (contract)
  - Project Proposal (proposal)
  - Mutual NDA (nda)
- **Merge fields** displayed as tags
- **Reusable** — select template when creating new document

### AI Document Writer

- **Brief-based generation** — describe what you need, get a complete document
- **Type selection** — proposal, contract, quotation, or NDA
- **Simulated LLM** — generates realistic documents based on brief
- **Monthly quota enforcement**:
  - Free: 3 quotes/month
  - Pro: 25 quotes/month
  - Ultra: 100 quotes/month
- **Quota display** — shows remaining count in header
- **Monthly reset** — automatically resets on first use after reset date
- **Save as document** — generated content can be saved directly
- **Regenerate** — try again if not satisfied

### E-Signature Flow

#### Send for Signature
- **From document editor** — click "Send for signature"
- **Signer details** — name and email (pre-filled from client)
- **Secure token** — unique signing link generated
- **Status tracking** — pending → viewed → signed/declined

#### Signing View (Client Side)
- **Document preview** — full document content displayed
- **Review warning** — amber alert to read carefully
- **Two signature modes**:
  - **Typed** — type name, see serif font preview
  - **Drawn** — canvas area for drawing (simulated with text input)
- **Sign button** — captures signature data
- **Decline option** — with required reason
- **Audit capture** — IP address, user agent, timestamps

#### Audit Trail (Agency Side)
- **Complete audit view** — all signature events
- **Signer details** — name, email
- **Timeline** — viewed, signed/declined timestamps
- **Technical data** — IP address, user agent
- **Signature preview** — typed (serif font) or drawn (image)
- **Decline reason** — if declined
- **Print certificate** — audit trail printable as PDF

### Intake Forms

#### Form Builder
- **Drag-and-drop field builder** — add/remove/reorder fields
- **10 field types**:
  - Short text
  - Long text (textarea)
  - Email
  - Phone
  - Number
  - Dropdown (select)
  - Multi-select (checkboxes)
  - Date
  - Checkbox
  - File upload
- **Required flags** — per-field toggle
- **Options** — for select/multiselect fields
- **Form metadata** — title, description

#### Public Form Access
- **Tokenized URLs** — `clientertap.com/form/{token}`
- **No login required** — anyone with link can submit
- **Form preview** — agency can preview before sharing
- **Copy link** — one-click copy to clipboard
- **Revoke/regenerate** — invalidate old token, generate new one

#### Response Tracking
- **Response count** — displayed on form card
- **Stored data** — all responses saved with timestamps
- **Metadata** — IP address, user agent captured
- **Activity log** — form submission logged if linked to client

### Data Models Added

```typescript
Document {
  id, workspaceId, type, title, body (HTML)
  clientId, projectId, status
  templateId, version, createdBy
  sentAt, viewedAt, signedAt, declinedAt, expiresAt
}

DocumentTemplate {
  id, workspaceId, name, type, body
  mergeFields[], isDefault
}

Signature {
  id, workspaceId, documentId
  signerName, signerEmail, signerRole
  status (pending/viewed/signed/declined/expired)
  signatureData, signatureType (typed/drawn)
  token (unique signing link)
  viewedAt, signedAt, declinedAt, declinedReason
  ipAddress, userAgent
}

IntakeForm {
  id, workspaceId, title, description
  fields[] (IntakeFormField)
  clientId, projectId
  token (public access)
  isActive, responseCount
}

IntakeFormField {
  id, type, label, placeholder, required
  options[] (for select/multiselect)
}

IntakeResponse {
  id, workspaceId, formId
  data (Record<string, any>)
  submittedAt, ipAddress, userAgent
}
```

### Store Actions Added

```typescript
// Documents
addDocument(doc) → { documentId }
updateDocument(id, updates)
deleteDocument(id)
sendDocument(id, signerEmail, signerName, signerRole) → { signatureId, token }

// Signatures
viewSignature(token) → { signature }
signDocument(signatureId, signatureData, signatureType)
declineSignature(signatureId, reason)

// AI
aiWriteDocument(brief, type) → { body } // counts against quota

// Intake Forms
addIntakeForm(form) → { formId, token }
updateIntakeForm(id, updates)
deleteIntakeForm(id)
regenerateFormToken(id)
submitIntakeForm(formId, data)
```

## 🧪 Manual Testing Script

### Test 1: Create Document from Template
1. Go to **Documents** page
2. Click **"New document"**
3. Enter title: "Website Redesign Proposal"
4. Select type: "Proposal"
5. Select client: "Bright Media"
6. Select template: "Project Proposal"
7. Verify template content loaded with merge fields
8. Click **"Create document"**
9. Verify document appears in list with status "draft"

### Test 2: Edit Document
1. Click **"View"** on the document
2. Verify document preview with merge fields replaced
3. Edit content in the HTML textarea
4. Click **"Save draft"**
5. Verify version incremented (v2)

### Test 3: AI Document Writer
1. Click **"Write with AI"** button
2. Verify quota display: "24 of 25 AI quotes remaining"
3. Select type: "Contract"
4. Enter brief: "Brand design project for a D2C skincare company"
5. Click **"Generate document"**
6. Verify loading spinner appears
7. Verify generated document appears after 1.5s
8. Click **"Save as document"**
9. Enter title, verify saved
10. Verify quota now shows "23 of 25"

### Test 4: Send for E-Signature
1. Open a draft document
2. Click **"Send for signature"**
3. Enter signer name: "Ananya Gupta"
4. Enter signer email: "ananya@novastudio.in"
5. Click **"Send"**
6. Verify document status changes to "sent"
7. Go to **E-Signatures** tab
8. Verify signature request appears with status "pending"

### Test 5: Sign Document (Simulated Client)
1. In **E-Signatures** tab, click **"View audit"** on pending signature
2. Verify document content displayed
3. Select **"Type signature"** mode
4. Type: "Ananya Gupta"
5. Verify serif font preview appears
6. Click **"Sign document"**
7. Verify signature status changes to "signed"
8. Verify document status changes to "signed"

### Test 6: View Audit Trail
1. In **E-Signatures** tab, click **"View audit"** on signed signature
2. Verify audit trail displayed:
   - Signer name and email
   - Status: signed
   - Viewed timestamp
   - Signed timestamp
   - IP address
   - User agent
   - Signature type: typed
   - Signature preview (serif font)
3. Click **"Download audit certificate (PDF)"**
4. Verify print dialog opens

### Test 7: Decline Signature
1. Create new document, send for signature
2. In signing view, click **"Decline"**
3. Enter reason: "Need to review with legal team"
4. Click **"Confirm decline"**
5. Verify signature status: "declined"
6. Verify decline reason stored

### Test 8: Build Intake Form
1. Go to **Intake Forms** tab
2. Click **"New intake form"**
3. Enter title: "Project Brief"
4. Enter description: "Tell us about your project"
5. Add fields:
   - Short text: "Project Name" (required)
   - Email: "Contact Email" (required)
   - Dropdown: "Service Type" with options: Web Design, Branding, Marketing
   - Long text: "Project Description" (required)
   - Checkbox: "I agree to terms"
6. Click **"Create form"**
7. Verify form appears in list with token URL

### Test 9: Submit Intake Form (Public)
1. In **Intake Forms** tab, click **"Preview"** on the form
2. Verify public form displayed (no login required)
3. Fill in all fields
4. Click **"Submit"**
5. Verify success message: "Thank you!"
6. Close preview
7. Verify response count incremented

### Test 10: Revoke Form Link
1. In **Intake Forms** tab, click **"Revoke"** on a form
2. Confirm action
3. Verify new token generated
4. Verify old URL no longer works (would show error in production)

### Test 11: AI Quota Enforcement
1. Go to **Settings** → **Billing**
2. Downgrade to Free plan (3 AI quotes/month)
3. Go to **Documents** → **Write with AI**
4. Verify quota shows "3 of 3"
5. Generate 3 documents
6. Try to generate 4th
7. Verify error: "AI quote limit reached"
8. Upgrade to Pro → verify quota resets to 25

### Test 12: Document Print/PDF
1. Open any document
2. Click **"Print / PDF"**
3. Verify print dialog opens
4. Verify document formatted correctly
5. Save as PDF (browser feature)

## 📊 Feature Parity Status

**Phase 5: 23/23 features built ✅**

All document management features are complete:
- Document CRUD with templates
- AI document generation with quota
- Full e-signature lifecycle
- Intake form builder with public links
- Audit trails and compliance

## 🔜 Next Phase

**Phase 6 — Scheduling & Team**: Google Calendar/Meet sync, Web Push reminders, team management, payroll

## 🚫 Blocked Items (Need Credentials)

- Real LLM API (OpenAI/Anthropic) for AI document generation
- Real PDF generation service (Puppeteer/DocRaptor)
- Real e-signature storage (encrypted at rest)
- Real file upload for intake forms (Supabase Storage)
- Email notifications for signature requests

## 💡 Notes

- AI document generation is simulated with template-based content (production would call LLM API)
- E-signature uses text input for "drawn" mode (production would use HTML5 Canvas)
- PDF export uses browser print dialog (production would use server-side PDF generation)
- All data persists in localStorage (production would use Supabase)
- IP address and user agent are captured but simulated (production would get from request headers)
- Form submissions are stored locally (production would use Supabase with RLS)
