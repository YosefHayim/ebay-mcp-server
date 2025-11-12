# Security Policy

## Overview

The eBay API MCP Server project takes security seriously. We appreciate the security community's efforts in responsibly disclosing vulnerabilities and will make every effort to acknowledge and address reported issues promptly.

This document outlines our security policy, including supported versions, how to report vulnerabilities, and our disclosure process.

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 1.1.x   | ✅ Yes             | Current stable release |
| 1.0.x   | ⚠️ Limited         | Security fixes only |
| < 1.0   | ❌ No              | Unsupported |

**Note:** We strongly recommend always using the latest version to benefit from security fixes and improvements.

## Security Considerations

### Sensitive Data

This MCP server handles sensitive information:

- **eBay API Credentials** - Client ID, Client Secret, Redirect URI
- **OAuth Tokens** - User access tokens, refresh tokens
- **Personal Data** - Accessed through eBay APIs (orders, customer info, etc.)

### Token Storage

Tokens are stored locally in `.ebay-mcp-tokens.json`:

- ✅ File is included in `.gitignore` (never commit tokens)
- ⚠️ File should have restricted permissions (600 recommended)
- ⚠️ Contains sensitive OAuth tokens with API access
- ⚠️ Backup tokens securely if needed

### Environment Variables

The `.env` file contains sensitive credentials:

- ✅ Included in `.gitignore`
- ⚠️ Never commit `.env` to version control
- ⚠️ Use environment-specific files (`.env.production`, `.env.sandbox`)
- ⚠️ Rotate credentials if exposed

### Best Practices

When deploying or using this server:

1. **Production Deployment**:
   - Use environment variables instead of `.env` files
   - Enable OAuth 2.1 authentication for HTTP mode
   - Use HTTPS for all external connections
   - Implement proper secret management (AWS Secrets Manager, HashiCorp Vault, etc.)
   - Restrict network access to authorized clients only

2. **Development**:
   - Use eBay sandbox environment for testing
   - Never use production credentials in development
   - Keep dependencies up to date (`npm audit`, `pnpm audit`)
   - Review code changes for security implications

3. **Token Management**:
   - Rotate tokens regularly
   - Revoke tokens when no longer needed
   - Monitor token usage for anomalies
   - Use short-lived access tokens

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

We use GitHub's Private Vulnerability Reporting feature for secure disclosure. This allows you to privately report vulnerabilities directly to the maintainers.

### How to Report

1. **Use GitHub Security Advisory** (Recommended):
   - Go to the [Security tab](https://github.com/YosefHayim/ebay-api-mcp-server/security)
   - Click "Report a vulnerability"
   - Fill out the form with detailed information
   - Submit the report

2. **Email** (Alternative):
   - Send details to the repository maintainers
   - Include "SECURITY" in the subject line
   - Encrypt sensitive information if possible

### What to Include

A good vulnerability report should include:

1. **Vulnerability Type**:
   - Classification (e.g., XSS, SQL Injection, Authentication bypass)
   - CWE ID if applicable

2. **Affected Component**:
   - File path and line numbers
   - Version numbers affected
   - Configuration requirements

3. **Impact Assessment**:
   - Who can exploit this vulnerability?
   - What can an attacker achieve?
   - Are there any prerequisites?
   - What data or systems are at risk?

4. **Reproduction Steps**:
   - Complete step-by-step instructions
   - Specific configuration details
   - Any required tools or setup
   - Proof-of-concept code (if applicable)

5. **Suggested Fix** (Optional):
   - Your recommendation for addressing the issue
   - Alternative mitigations
   - Reference implementations

### Example Report Template

```markdown
## Vulnerability Type
[e.g., Authentication bypass, Token exposure, etc.]

## Affected Versions
[e.g., All versions, 1.1.0-1.1.3, etc.]

## Description
[Clear description of the vulnerability]

## Impact
[What can an attacker achieve? What data is at risk?]

## Steps to Reproduce
1. [First step]
2. [Second step]
3. [etc.]

## Proof of Concept
[Code, screenshots, or demonstration]

## Suggested Remediation
[Your recommendation for fixing the issue]

## References
[Links to relevant documentation, CVEs, CWEs, etc.]
```

## Response Timeline

We are committed to responding to security reports in a timely manner:

| Timeframe | Action |
|-----------|--------|
| **48 hours** | Initial acknowledgment of report |
| **7 days** | Preliminary assessment and triage |
| **30 days** | Regular updates on investigation progress |
| **90 days** | Target for fix release (critical issues prioritized) |

**Note:** Complex vulnerabilities may require more time. We will keep you informed throughout the process.

## Disclosure Process

We follow coordinated vulnerability disclosure:

1. **Report Received**: Maintainers acknowledge receipt within 48 hours
2. **Assessment**: We validate and assess the severity (using CVSS scoring)
3. **Fix Development**: We develop and test a patch
4. **Security Advisory**: We prepare a GitHub Security Advisory (private)
5. **Release**: We release a patched version with security notes
6. **Public Disclosure**: After patch release, we publish the advisory

### Severity Levels

We use CVSS 3.1 scoring to determine severity:

| Score | Severity | Response Time |
|-------|----------|---------------|
| 9.0-10.0 | **Critical** | Immediate (< 7 days) |
| 7.0-8.9 | **High** | Urgent (< 14 days) |
| 4.0-6.9 | **Medium** | Standard (< 30 days) |
| 0.1-3.9 | **Low** | Planned (< 90 days) |

### Embargo Period

- **Standard**: 90 days from initial report
- **Critical vulnerabilities**: Reduced embargo period (coordinated with reporter)
- **Exploited in the wild**: Immediate disclosure after patch

We will coordinate with you on disclosure timing and credit attribution.

## Security Updates

Security updates are announced through:

1. **GitHub Security Advisories**: Official vulnerability disclosures
2. **Release Notes**: Security fixes highlighted in CHANGELOG.md
3. **GitHub Releases**: Tagged releases with security information
4. **npm/pnpm**: Updated package versions

Subscribe to repository notifications to stay informed about security updates.

## Bug Bounty Program

**Current Status**: No formal bug bounty program

However, we deeply appreciate security researchers' contributions:

- ✅ Public acknowledgment (with your permission)
- ✅ Listed in CHANGELOG.md and security advisory
- ✅ GitHub contributor status

## Known Security Limitations

### Current Limitations

1. **Token Storage**: Tokens stored in plain text file locally
   - **Mitigation**: File permissions, `.gitignore`, secure deployment practices

2. **No Built-in Encryption**: Credentials in `.env` not encrypted
   - **Mitigation**: Use platform-specific secret management in production

3. **Rate Limiting**: Client-side rate limiting can be bypassed
   - **Mitigation**: eBay API has server-side rate limits

### Future Enhancements

We plan to address these limitations in future releases:

- 🔐 Optional token encryption at rest
- 🔐 Integration with secret management services
- 🔐 Enhanced audit logging
- 🔐 Role-based access control (RBAC) for HTTP mode

## Security Best Practices for Users

### For Server Operators

1. **Keep Updated**: Regularly update to latest version
2. **Monitor Logs**: Review logs for suspicious activity
3. **Restrict Access**: Limit network access to authorized clients
4. **Use HTTPS**: Always use encrypted connections
5. **Token Rotation**: Regularly rotate OAuth tokens
6. **Audit Dependencies**: Run `npm audit` or `pnpm audit` regularly

### For Developers

1. **Code Review**: Review all code changes for security implications
2. **Input Validation**: Validate all inputs using Zod schemas
3. **Error Handling**: Don't expose sensitive information in errors
4. **Dependency Updates**: Keep dependencies current
5. **Testing**: Include security tests in test suite

## References

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [CVSS Calculator](https://www.first.org/cvss/calculator/3.1)
- [GitHub Security](https://docs.github.com/en/code-security)
- [eBay Security](https://developer.ebay.com/api-docs/static/security.html)

## Contact

For security-related questions or concerns:

- **GitHub Security Advisories**: [Report a vulnerability](https://github.com/YosefHayim/ebay-api-mcp-server/security/advisories/new)
- **General Security Questions**: Open a GitHub Discussion with `[SECURITY]` prefix

---

**Thank you for helping keep the eBay API MCP Server and its users safe!** 🔒
