import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StateBadge } from './state-badge';
import { MissionState, MissionReason } from '@prisma/client';

describe('StateBadge', () => {
  it('should render Backlog label', () => {
    render(<StateBadge state={MissionState.Backlog} />);
    expect(screen.getByText('Backlog')).toBeDefined();
  });

  it('should render En cours for Active', () => {
    render(<StateBadge state={MissionState.Active} />);
    expect(screen.getByText('En cours')).toBeDefined();
  });

  it('should render Bloqué for Suspended with Blocked reason', () => {
    render(<StateBadge state={MissionState.Suspended} reason={MissionReason.Blocked} />);
    expect(screen.getByText('Bloqué')).toBeDefined();
  });

  it('should render Terminé for Terminated with Done reason', () => {
    render(<StateBadge state={MissionState.Terminated} reason={MissionReason.Done} />);
    expect(screen.getByText('Terminé')).toBeDefined();
  });
});
