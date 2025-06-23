# TutorialKit Templates

This directory contains the template projects that serve as the foundation for all tutorial lessons.

## How Templates Work

1. **Base Template**: The files in each template directory (like `default/`) provide the basic project structure
2. **Lesson Overlay**: When a lesson loads, TutorialKit takes the template and overlays the files from the lesson's `_files/` directory
3. **Working Environment**: This creates a complete, runnable project in the browser

## Template Structure

- `default/` - The default template used by all lessons unless otherwise specified
- Each template must be a complete, working project that can run independently
- Templates should include all necessary configuration files (package.json, etc.)

## Using Different Templates

You can specify a different template in a lesson's frontmatter:

```yaml
---
title: My Lesson
template: my-custom-template
---
```

This will use the `src/templates/my-custom-template/` directory instead of the default.

## Important Notes

- **Never delete this directory** - TutorialKit requires templates to function
- Templates are the foundation that makes the code editor work
- Each lesson's `_files/` directory contains only the files that differ from the template
